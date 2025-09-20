# Twitter Home Mixer - Component Reference Guide

## Overview

This document provides detailed technical specifications for each component in the Twitter Home Mixer system, including interfaces, implementations, and configuration options.

---

## 1. Core Service Interfaces

### 1.1 CandidateGenerator Interface

```scala
/**
 * Base interface for candidate generation services
 */
trait CandidateGenerator {
  /**
   * Generate candidates for a given user and context
   * @param userId Target user identifier
   * @param context Request context including user state and preferences
   * @return Future sequence of candidates
   */
  def generateCandidates(userId: UserId, context: RequestContext): Future[Seq[Candidate]]

  /**
   * Get the name of this generator for logging and monitoring
   * @return Generator name
   */
  def getGeneratorName(): String

  /**
   * Check if this generator is eligible for the given user
   * @param userId User to check eligibility for
   * @return Boolean indicating eligibility
   */
  def isEligible(userId: UserId): Boolean

  /**
   * Get the maximum number of candidates this generator can produce
   * @return Maximum candidate count
   */
  def getMaxCandidates(): Int

  /**
   * Get the timeout for this generator
   * @return Timeout duration
   */
  def getTimeout(): Duration
}

/**
 * Request context containing user state and preferences
 */
case class RequestContext(
  userId: UserId,
  sessionId: SessionId,
  timestamp: Instant,
  deviceInfo: DeviceInfo,
  locationInfo: LocationInfo,
  userPreferences: UserPreferences,
  previousInteractions: Seq[UserInteraction],
  currentSession: SessionContext
)

/**
 * Candidate representation with metadata
 */
case class Candidate(
  candidateId: CandidateId,
  contentId: ContentId,
  authorId: UserId,
  contentType: ContentType,
  source: CandidateSource,
  generationTime: Instant,
  metadata: Map[String, Any]
)
```

### 1.2 FeatureHydrator Interface

```scala
/**
 * Base interface for feature hydration services
 */
trait FeatureHydrator {
  /**
   * Hydrate candidates with features
   * @param candidates Candidates to hydrate
   * @param context Request context
   * @return Future sequence of hydrated candidates
   */
  def hydrate(candidates: Seq[Candidate], context: RequestContext): Future[Seq[HydratedCandidate]]

  /**
   * Get the names of features this hydrator provides
   * @return Sequence of feature names
   */
  def getFeatureNames(): Seq[String]

  /**
   * Get the priority of this hydrator (lower = higher priority)
   * @return Priority level
   */
  def getPriority(): Int

  /**
   * Check if this hydrator supports the given feature
   * @param featureName Feature name to check
   * @return Boolean indicating support
   */
  def supportsFeature(featureName: String): Boolean
}

/**
 * Candidate with hydrated features
 */
case class HydratedCandidate(
  candidate: Candidate,
  features: Map[String, FeatureValue],
  hydrationTime: Instant,
  hydratorInfo: Map[String, Any]
)

/**
 * Feature value with metadata
 */
sealed trait FeatureValue {
  def value: Any
  def timestamp: Instant
  def source: FeatureSource
}

case class NumericalFeature(value: Double, timestamp: Instant, source: FeatureSource) extends FeatureValue
case class CategoricalFeature(value: String, timestamp: Instant, source: FeatureSource) extends FeatureValue
case class VectorFeature(value: Array[Double], timestamp: Instant, source: FeatureSource) extends FeatureValue
```

### 1.3 Scorer Interface

```scala
/**
 * Base interface for scoring services
 */
trait Scorer {
  /**
   * Score candidates based on features and context
   * @param candidates Candidates to score
   * @param context Request context
   * @return Future sequence of scored candidates
   */
  def score(candidates: Seq[HydratedCandidate], context: RequestContext): Future[Seq[ScoredCandidate]]

  /**
   * Get the name of this scorer
   * @return Scorer name
   */
  def getScorerName(): String

  /**
   * Get the model version being used
   * @return Model version
   */
  def getModelVersion(): String

  /**
   * Check if this scorer is available
   * @return Boolean indicating availability
   */
  def isAvailable(): Boolean

  /**
   * Get the scoring latency target
   * @return Target latency
   */
  def getLatencyTarget(): Duration
}

/**
 * Candidate with score and metadata
 */
case class ScoredCandidate(
  candidate: HydratedCandidate,
  score: Double,
  confidence: Double,
  scorerInfo: ScorerInfo,
  scoringTime: Instant
)

/**
 * Information about the scoring process
 */
case class ScorerInfo(
  scorerName: String,
  modelVersion: String,
  featuresUsed: Seq[String],
  explanation: Option[String]
)
```

---

## 2. Core Implementation Classes

### 2.1 HomeMixerService

```scala
/**
 * Main service orchestrating the Home Mixer pipeline
 */
class HomeMixerService(
  candidateGenerators: Seq[CandidateGenerator],
  featureHydrators: Seq[FeatureHydrator],
  scorers: Seq[Scorer],
  config: HomeMixerConfig
) extends Logging {

  /**
   * Generate home timeline for a user
   * @param request Home timeline request
   * @return Future containing timeline response
   */
  def generateTimeline(request: HomeTimelineRequest): Future[HomeTimelineResponse] = {
    val startTime = System.currentTimeMillis()

    for {
      context <- buildContext(request)
      candidates <- generateCandidates(context)
      hydratedCandidates <- hydrateFeatures(candidates, context)
      scoredCandidates <- scoreCandidates(hydratedCandidates, context)
      rankedCandidates <- rankCandidates(scoredCandidates, context)
      filteredCandidates <- filterCandidates(rankedCandidates, context)
    } yield {
      val latency = System.currentTimeMillis() - startTime
      HomeTimelineResponse(
        candidates = filteredCandidates,
        metadata = TimelineMetadata(
          requestId = request.requestId,
          processingTimeMs = latency,
          candidateCount = candidates.size,
          filteredCount = rankedCandidates.size - filteredCandidates.size
        )
      )
    }
  }

  private def generateCandidates(context: RequestContext): Future[Seq[Candidate]] = {
    val eligibleGenerators = candidateGenerators.filter(_.isEligible(context.userId))

    Future.traverse(eligibleGenerators) { generator =>
      timeout(generator.generateCandidates(context.userId, context), generator.getTimeout())
        .recover { case _: TimeoutException => Seq.empty[Candidate] }
    }.map(_.flatten)
  }

  private def hydrateFeatures(candidates: Seq[Candidate], context: RequestContext): Future[Seq[HydratedCandidate]] = {
    if (candidates.isEmpty) {
      Future.successful(Seq.empty)
    } else {
      // Batch candidates for efficient processing
      val batchedCandidates = candidates.grouped(config.featureHydrationBatchSize).toSeq

      Future.traverse(batchedCandidates) { batch =>
        Future.traverse(featureHydrators) { hydrator =>
          timeout(hydrator.hydrate(batch, context), config.featureHydrationTimeout)
            .recover { case _: TimeoutException => batch.map(c => HydratedCandidate(c, Map.empty, Instant.now(), Map.empty)) }
        }
      }.map(_.flatten.flatten)
    }
  }

  private def scoreCandidates(candidates: Seq[HydratedCandidate], context: RequestContext): Future[Seq[ScoredCandidate]] = {
    if (candidates.isEmpty) {
      Future.successful(Seq.empty)
    } else {
      val availableScorers = scorers.filter(_.isAvailable())

      Future.traverse(availableScorers) { scorer =>
        timeout(scorer.score(candidates, context), scorer.getLatencyTarget())
          .recover { case _: TimeoutException => Seq.empty[ScoredCandidate] }
      }.map(_.flatten)
    }
  }

  private def rankCandidates(candidates: Seq[ScoredCandidate], context: RequestContext): Future[Seq[ScoredCandidate]] = {
    Future.successful {
      candidates
        .groupBy(_.candidate.candidate.candidateId)
        .map { case (_, scores) =>
          // Combine scores from multiple scorers
          val combinedScore = combineScores(scores)
          scores.head.copy(score = combinedScore)
        }
        .toSeq
        .sortBy(_.score)(Ordering[Double].reverse)
    }
  }

  private def filterCandidates(candidates: Seq[ScoredCandidate], context: RequestContext): Future[Seq[ScoredCandidate]] = {
    Future.successful {
      candidates
        .take(config.maxTimelineSize)
        .filter(_.score > config.minScoreThreshold)
    }
  }

  private def combineScores(scores: Seq[ScoredCandidate]): Double = {
    // Weighted combination of scores
    val weights = Map(
      "LightRank" -> 0.3,
      "HeavyRank" -> 0.7
    )

    scores.map { scored =>
      weights.getOrElse(scored.scorerInfo.scorerName, 0.0) * scored.score
    }.sum
  }

  private def timeout[T](future: Future[T], duration: Duration): Future[T] = {
    Promise.timeout(future, duration)
  }
}
```

### 2.2 FeatureStore Implementation

```scala
/**
 * Feature store implementation with caching and batch retrieval
 */
class FeatureStore(
  onlineStore: OnlineFeatureStore,
  offlineStore: OfflineFeatureStore,
  cache: FeatureCache,
  config: FeatureStoreConfig
) extends Logging {

  /**
   * Get features for multiple candidates efficiently
   * @param candidateIds Candidate identifiers
   * @param featureNames Feature names to retrieve
   * @return Map of candidate ID to features
   */
  def getFeatures(
    candidateIds: Seq[CandidateId],
    featureNames: Seq[String]
  ): Future[Map[CandidateId, Map[String, FeatureValue]]] = {
    val startTime = System.currentTimeMillis()

    for {
      // Check cache first
      cachedFeatures <- cache.getFeatures(candidateIds, featureNames)
      uncachedCandidateIds = candidateIds.filterNot(cachedFeatures.contains)

      // Fetch uncached features
      onlineFeatures <- if (uncachedCandidateIds.nonEmpty) {
        onlineStore.getFeatures(uncachedCandidateIds, featureNames)
      } else {
        Future.successful(Map.empty)
      }

      // Fall back to offline store for missing features
      offlineFeatures <- if (onlineFeatures.size < uncachedCandidateIds.size) {
        val missingIds = uncachedCandidateIds.filterNot(onlineFeatures.contains)
        offlineStore.getFeatures(missingIds, featureNames)
      } else {
        Future.successful(Map.empty)
      }

      // Combine all features
      allFeatures = cachedFeatures ++ onlineFeatures ++ offlineFeatures

      // Update cache
      _ <- if (allFeatures.nonEmpty) {
        cache.setFeatures(allFeatures, config.cacheTtl)
      } else {
        Future.successful(())
      }

    } yield {
      val latency = System.currentTimeMillis() - startTime
      log.info(s"Feature retrieval completed in ${latency}ms for ${candidateIds.size} candidates")
      allFeatures
    }
  }

  /**
   * Update features in real-time
   * @param candidateId Candidate identifier
   * @param features Features to update
   * @return Future indicating completion
   */
  def updateFeatures(
    candidateId: CandidateId,
    features: Map[String, FeatureValue]
  ): Future[Unit] = {
    for {
      _ <- onlineStore.updateFeatures(candidateId, features)
      _ <- cache.invalidateFeatures(candidateId, features.keys.toSeq)
    } yield {
      log.debug(s"Updated features for candidate $candidateId")
    }
  }

  /**
   * Get feature metadata
   * @param featureName Feature name
   * @return Feature metadata
   */
  def getFeatureMetadata(featureName: String): Future[Option[FeatureMetadata]] = {
    onlineStore.getFeatureMetadata(featureName)
  }
}

/**
 * Online feature store interface
 */
trait OnlineFeatureStore {
  def getFeatures(
    candidateIds: Seq[CandidateId],
    featureNames: Seq[String]
  ): Future[Map[CandidateId, Map[String, FeatureValue]]]

  def updateFeatures(
    candidateId: CandidateId,
    features: Map[String, FeatureValue]
  ): Future[Unit]

  def getFeatureMetadata(featureName: String): Future[Option[FeatureMetadata]]
}

/**
 * Offline feature store interface
 */
trait OfflineFeatureStore {
  def getFeatures(
    candidateIds: Seq[CandidateId],
    featureNames: Seq[String]
  ): Future[Map[CandidateId, Map[String, FeatureValue]]]
}
```

### 2.3 Real-time Processor Implementation

```scala
/**
 * Real-time event processing service
 */
class RealtimeProcessor(
  eventConsumer: EventConsumer,
  featureUpdater: FeatureUpdater,
  modelUpdater: ModelUpdater,
  config: RealtimeProcessorConfig
) extends Logging {

  /**
   * Start processing real-time events
   * @return Future indicating completion
   */
  def start(): Future[Unit] = {
    log.info("Starting real-time processor")

    eventConsumer.consume(config.eventTopic) { event =>
      processEvent(event)
        .recover { case e =>
          log.error(s"Failed to process event ${event.eventId}: ${e.getMessage}", e)
        }
    }
  }

  /**
   * Process a single real-time event
   * @param event Event to process
   * @return Future indicating completion
   */
  private def processEvent(event: UserEvent): Future[Unit] = {
    event.eventType match {
      case EventType.Engagement =>
        processEngagementEvent(event.asInstanceOf[EngagementEvent])
      case EventType.Content =>
        processContentEvent(event.asInstanceOf[ContentEvent])
      case EventType.Social =>
        processSocialEvent(event.asInstanceOf[SocialEvent])
      case EventType.System =>
        processSystemEvent(event.asInstanceOf[SystemEvent])
    }
  }

  private def processEngagementEvent(event: EngagementEvent): Future[Unit] = {
    for {
      // Update user engagement features
      _ <- featureUpdater.updateUserFeatures(event.userId, event.features)

      // Update content engagement features
      _ <- featureUpdater.updateContentFeatures(event.contentId, event.features)

      // Update model with new engagement data
      _ <- modelUpdater.updateEngagementModel(event)

    } yield {
      log.debug(s"Processed engagement event for user ${event.userId}")
    }
  }

  private def processContentEvent(event: ContentEvent): Future[Unit] = {
    for {
      // Update content features
      _ <- featureUpdater.updateContentFeatures(event.contentId, event.features)

      // Update trending features
      _ <- featureUpdater.updateTrendingFeatures(event.contentId, event.features)

      // Invalidate cached content
      _ <- featureUpdater.invalidateContentCache(event.contentId)

    } yield {
      log.debug(s"Processed content event for content ${event.contentId}")
    }
  }

  private def processSocialEvent(event: SocialEvent): Future[Unit] = {
    for {
      // Update social graph features
      _ <- featureUpdater.updateSocialFeatures(event.sourceUserId, event.targetUserId, event.features)

      // Update user network features
      _ <- featureUpdater.updateUserNetworkFeatures(event.sourceUserId, event.features)

    } yield {
      log.debug(s"Processed social event from user ${event.sourceUserId}")
    }
  }

  private def processSystemEvent(event: SystemEvent): Future[Unit] = {
    event.systemEventType match {
      case SystemEventType.ModelUpdate =>
        modelUpdater.loadModel(event.modelId, event.modelVersion)
      case SystemEventType.ConfigUpdate =>
        updateConfig(event.config)
      case SystemEventType.CacheInvalidation =>
        featureUpdater.invalidateCache(event.cacheKeys)
    }
  }

  /**
   * Stop processing real-time events
   * @return Future indicating completion
   */
  def stop(): Future[Unit] = {
    log.info("Stopping real-time processor")
    eventConsumer.stop()
  }
}
```

---

## 3. Configuration Classes

### 3.1 HomeMixerConfig

```scala
/**
 * Configuration for Home Mixer service
 */
case class HomeMixerConfig(
  // Pipeline configuration
  maxTimelineSize: Int = 200,
  minScoreThreshold: Double = 0.1,
  enableDebugMode: Boolean = false,

  // Candidate generation configuration
  candidateGenerationTimeout: Duration = 100.millis,
  maxCandidatesPerGenerator: Int = 100,
  enableCandidateDeduplication: Boolean = true,

  // Feature hydration configuration
  featureHydrationTimeout: Duration = 150.millis,
  featureHydrationBatchSize: Int = 50,
  enableFeatureCaching: Boolean = true,
  featureCacheTtl: Duration = 5.minutes,

  // Scoring configuration
  scoringTimeout: Duration = 200.millis,
  enableMultiScorer: Boolean = true,
  scorerWeights: Map[String, Double] = Map(
    "LightRank" -> 0.3,
    "HeavyRank" -> 0.7
  ),

  // Filtering configuration
  enableSafetyFiltering: Boolean = true,
  enableQualityFiltering: Boolean = true,
  enableDiversityFiltering: Boolean = true,

  // Performance configuration
  enableMetricsCollection: Boolean = true,
  enableProfiling: Boolean = false,
  enableTracing: Boolean = true,

  // Feature flags
  enableExperimentalFeatures: Boolean = false,
  enableABTesting: Boolean = true,
  enableRealtimeUpdates: Boolean = true
)
```

### 3.2 FeatureStoreConfig

```scala
/**
 * Configuration for feature store
 */
case class FeatureStoreConfig(
  // Cache configuration
  cacheTtl: Duration = 5.minutes,
  cacheMaxSize: Int = 10000,
  cacheConcurrencyLevel: Int = 16,

  // Online store configuration
  onlineStoreTimeout: Duration = 50.millis,
  onlineStoreBatchSize: Int = 100,
  onlineStoreConnectionPoolSize: Int = 10,

  // Offline store configuration
  offlineStoreTimeout: Duration = 100.millis,
  offlineStoreBatchSize: Int = 1000,
  offlineStoreReadCapacity: Int = 100,

  // Feature configuration
  enableFeatureValidation: Boolean = true,
  enableFeatureImputation: Boolean = true,
  enableFeatureNormalization: Boolean = true,

  // Performance configuration
  enableMetricsCollection: Boolean = true,
  enableLatencyTracking: Boolean = true,
  enableErrorTracking: Boolean = true
)
```

### 3.3 RealtimeProcessorConfig

```scala
/**
 * Configuration for real-time processor
 */
case class RealtimeProcessorConfig(
  // Event processing configuration
  eventTopic: String = "user-events",
  eventConsumerGroup: String = "home-mixer",
  eventPollTimeout: Duration = 100.millis,
  eventMaxPollRecords: Int = 500,

  // Processing configuration
  processingParallelism: Int = 4,
  processingTimeout: Duration = 1.second,
  enableBatchProcessing: Boolean = true,
  batchSize: Int = 100,

  // Feature update configuration
  featureUpdateInterval: Duration = 1.minute,
  featureUpdateBatchSize: Int = 1000,
  enableFeatureUpdateCaching: Boolean = true,

  // Model update configuration
  modelUpdateInterval: Duration = 10.minutes,
  enableOnlineLearning: Boolean = true,
  enableModelVersioning: Boolean = true,

  // Performance configuration
  enableMetricsCollection: Boolean = true,
  enableLatencyTracking: Boolean = true,
  enableErrorTracking: Boolean = true,

  // Monitoring configuration
  enableHealthChecks: Boolean = true,
  healthCheckInterval: Duration = 30.seconds,
  enableAlerting: Boolean = true
)
```

---

## 4. Data Models

### 4.1 Core Data Types

```scala
// User identifiers
case class UserId(value: String) extends AnyVal
case class SessionId(value: String) extends AnyVal
case class CandidateId(value: String) extends AnyVal
case class ContentId(value: String) extends AnyVal

// Content types
sealed trait ContentType
case object Tweet extends ContentType
case object Retweet extends ContentType
case object Reply extends ContentType
case object Media extends ContentType

// Candidate sources
sealed trait CandidateSource
case class FollowGraph(userId: UserId) extends CandidateSource
case class InterestGraph(topicId: String) extends CandidateSource
case class TrendingTopic(topicId: String) extends CandidateSource
case class SearchQuery(query: String) extends CandidateSource

// Event types
sealed trait EventType
case object Engagement extends EventType
case object Content extends EventType
case object Social extends EventType
case object System extends EventType

// System event types
sealed trait SystemEventType
case object ModelUpdate extends SystemEventType
case object ConfigUpdate extends SystemEventType
case object CacheInvalidation extends SystemEventType
```

### 4.2 Event Models

```scala
/**
 * Base event class
 */
sealed trait UserEvent {
  def eventId: String
  def userId: UserId
  def timestamp: Instant
  def eventType: EventType
}

/**
 * User engagement event
 */
case class EngagementEvent(
  eventId: String,
  userId: UserId,
  contentId: ContentId,
  engagementType: EngagementType,
  engagementValue: Double,
  timestamp: Instant,
  features: Map[String, FeatureValue]
) extends UserEvent {
  def eventType: EventType = EventType.Engagement
}

/**
 * Content event
 */
case class ContentEvent(
  eventId: String,
  contentId: ContentId,
  authorId: UserId,
  contentType: ContentType,
  timestamp: Instant,
  features: Map[String, FeatureValue]
) extends UserEvent {
  def eventType: EventType = EventType.Content
  def userId: UserId = authorId
}

/**
 * Social event
 */
case class SocialEvent(
  eventId: String,
  sourceUserId: UserId,
  targetUserId: UserId,
  socialType: SocialType,
  timestamp: Instant,
  features: Map[String, FeatureValue]
) extends UserEvent {
  def eventType: EventType = EventType.Social
  def userId: UserId = sourceUserId
}

/**
 * System event
 */
case class SystemEvent(
  eventId: String,
  systemEventType: SystemEventType,
  timestamp: Instant,
  metadata: Map[String, Any]
) extends UserEvent {
  def userId: UserId = UserId("system")
  def eventType: EventType = EventType.System
}
```

### 4.3 Request/Response Models

```scala
/**
 * Home timeline request
 */
case class HomeTimelineRequest(
  requestId: String,
  userId: UserId,
  sessionId: SessionId,
  maxResults: Int = 50,
  cursor: Option[String] = None,
  filter: Option[TimelineFilter] = None,
  context: RequestContext
)

/**
 * Home timeline response
 */
case class HomeTimelineResponse(
  candidates: Seq[ScoredCandidate],
  metadata: TimelineMetadata,
  nextCursor: Option[String] = None
)

/**
 * Timeline metadata
 */
case class TimelineMetadata(
  requestId: String,
  processingTimeMs: Long,
  candidateCount: Int,
  filteredCount: Int,
  timelineVersion: String = "1.0"
)

/**
 * Timeline filter
 */
case class TimelineFilter(
  contentTypes: Option[Set[ContentType]] = None,
  timeRange: Option[TimeRange] = None,
  minScore: Option[Double] = None,
  excludeAuthors: Option[Set[UserId]] = None
)

/**
 * Time range
 */
case class TimeRange(
  startTime: Instant,
  endTime: Instant
)
```

---

## 5. Utility Classes

### 5.1 Metrics Collection

```scala
/**
 * Metrics collector for Home Mixer
 */
class MetricsCollector(
  registry: MetricsRegistry,
  config: MetricsConfig
) extends Logging {

  // Counter metrics
  private val requestCounter = registry.counter("home.mixer.requests")
  private val candidateCounter = registry.counter("home.mixer.candidates")
  private val errorCounter = registry.counter("home.mixer.errors")

  // Timer metrics
  private val requestTimer = registry.timer("home.mixer.request.duration")
  private val generationTimer = registry.timer("home.mixer.generation.duration")
  private val hydrationTimer = registry.timer("home.mixer.hydration.duration")
  private val scoringTimer = registry.timer("home.mixer.scoring.duration")

  // Gauge metrics
  private val activeUsersGauge = registry.gauge("home.mixer.active.users")
  private val cacheHitRateGauge = registry.gauge("home.mixer.cache.hit.rate")
  private val latencyGauge = registry.gauge("home.mixer.latency.p95")

  /**
   * Record a request
   * @param userId User ID
   * @param processingTime Processing time
   * @param candidateCount Number of candidates
   */
  def recordRequest(
    userId: UserId,
    processingTime: Long,
    candidateCount: Int
  ): Unit = {
    requestCounter.increment()
    requestTimer.record(processingTime, TimeUnit.MILLISECONDS)
    candidateCounter.increment(candidateCount)

    if (config.enableDetailedMetrics) {
      latencyGauge.set(processingTime)
    }
  }

  /**
   * Record candidate generation metrics
   * @param generatorName Generator name
   * @param candidateCount Number of candidates
   * @param processingTime Processing time
   */
  def recordCandidateGeneration(
    generatorName: String,
    candidateCount: Int,
    processingTime: Long
  ): Unit = {
    registry.counter(s"home.mixer.generation.$generatorName.candidates").increment(candidateCount)
    registry.timer(s"home.mixer.generation.$generatorName.duration").record(processingTime, TimeUnit.MILLISECONDS)
  }

  /**
   * Record feature hydration metrics
   * @param hydratorName Hydrator name
   * @param featureCount Number of features
   * @param processingTime Processing time
   */
  def recordFeatureHydration(
    hydratorName: String,
    featureCount: Int,
    processingTime: Long
  ): Unit = {
    registry.counter(s"home.mixer.hydration.$hydratorName.features").increment(featureCount)
    registry.timer(s"home.mixer.hydration.$hydratorName.duration").record(processingTime, TimeUnit.MILLISECONDS)
  }

  /**
   * Record scoring metrics
   * @param scorerName Scorer name
   * @param candidateCount Number of candidates
   * @param processingTime Processing time
   */
  def recordScoring(
    scorerName: String,
    candidateCount: Int,
    processingTime: Long
  ): Unit = {
    registry.counter(s"home.mixer.scoring.$scorerName.candidates").increment(candidateCount)
    registry.timer(s"home.mixer.scoring.$scorerName.duration").record(processingTime, TimeUnit.MILLISECONDS)
  }

  /**
   * Record an error
   * @param errorType Type of error
   * @param errorMessage Error message
   */
  def recordError(errorType: String, errorMessage: String): Unit = {
    errorCounter.increment()
    registry.counter(s"home.mixer.errors.$errorType").increment()
    log.error(s"Error recorded: $errorType - $errorMessage")
  }
}
```

### 5.2 Cache Manager

```scala
/**
 * Cache manager for feature caching
 */
class CacheManager(
  cache: Cache[String, Map[String, FeatureValue]],
  config: CacheConfig
) extends Logging {

  /**
   * Get features from cache
   * @param keys Cache keys
   * @return Future containing cached features
   */
  def getFeatures(keys: Seq[String]): Future[Map[String, Map[String, FeatureValue]]] = {
    Future {
      keys.flatMap { key =>
        cache.getIfPresent(key).map(key -> _)
      }.toMap
    }
  }

  /**
   * Set features in cache
   * @param features Features to cache
   * @param ttl Time to live
   * @return Future indicating completion
   */
  def setFeatures(
    features: Map[String, Map[String, FeatureValue]],
    ttl: Duration
  ): Future[Unit] = {
    Future {
      features.foreach { case (key, featureMap) =>
        cache.put(key, featureMap)
      }
      if (config.enableMetrics) {
        registry.counter("cache.puts").increment(features.size)
      }
    }
  }

  /**
   * Invalidate cache entries
   * @param keys Keys to invalidate
   * @return Future indicating completion
   */
  def invalidate(keys: Seq[String]): Future[Unit] = {
    Future {
      keys.foreach(cache.invalidate)
      if (config.enableMetrics) {
        registry.counter("cache.invalidations").increment(keys.size)
      }
    }
  }

  /**
   * Get cache statistics
   * @return Cache statistics
   */
  def getStats(): CacheStats = {
    CacheStats(
      size = cache.size(),
      hitCount = cache.stats().hitCount(),
      missCount = cache.stats().missCount(),
      hitRate = cache.stats().hitRate(),
      evictionCount = cache.stats().evictionCount()
    )
  }
}

/**
 * Cache statistics
 */
case class CacheStats(
  size: Long,
  hitCount: Long,
  missCount: Long,
  hitRate: Double,
  evictionCount: Long
)
```

---

## Conclusion

This component reference guide provides detailed technical specifications for each component in the Twitter Home Mixer system. The modular architecture allows for easy extension and customization while maintaining high performance and reliability.

Key design principles implemented:
- **Interface Segregation**: Clear separation of concerns with well-defined interfaces
- **Dependency Injection**: Flexible component configuration and testing
- **Async Processing**: Non-blocking operations for high throughput
- **Error Handling**: Comprehensive error handling and recovery mechanisms
- **Monitoring**: Extensive metrics collection and monitoring capabilities
- **Configuration**: Flexible configuration system for different environments

The components are designed to work together seamlessly while maintaining loose coupling, allowing for independent development, testing, and deployment of individual components.