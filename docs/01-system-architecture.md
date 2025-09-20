# Twitter Home Mixer Algorithm Documentation

## Table of Contents
- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Core Data Flow](#core-data-flow)
- [Component Interactions](#component-interactions)
- [Scoring and Ranking](#scoring-and-ranking)
- [Real-time Processing](#real-time-processing)
- [Machine Learning Integration](#machine-learning-integration)

## Overview

Twitter Home Mixer is the main service responsible for constructing and serving Twitter's Home Timelines. It powers three main feed types:

1. **For You** - Best tweets from people you follow + recommended out-of-network content
2. **Following** - Reverse chronological tweets from people you follow
3. **Lists** - Reverse chronological tweets from list members

The system is built on Product Mixer, Twitter's custom Scala framework for building content feeds.

### Key Processing Stages

```mermaid
graph TD
    A[User Request] --> B[Product Pipeline]
    B --> C[Mixer Pipeline]
    C --> D[Candidate Generation]
    D --> E[Feature Hydration]
    E --> F[Scoring & Ranking]
    F --> G[Filters & Heuristics]
    G --> H[Mixing & Integration]
    H --> I[Product Features]
    I --> J[Timeline Response]

    style A fill:#e1f5fe
    style J fill:#c8e6c9
```

## System Architecture

### High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A[Twitter App/Web]
        B[Mobile Clients]
    end

    subgraph "API Layer"
        C[HTTP Controller]
        D[Thrift Controller]
    end

    subgraph "Product Pipeline Layer"
        E[ForYou Pipeline]
        F[Following Pipeline]
        G[ListTweets Pipeline]
    end

    subgraph "Mixer Pipeline Layer"
        H[ForYou Mixer]
        I[Following Mixer]
        J[ListTweets Mixer]
    end

    subgraph "Candidate Sources"
        K[Earlybird Search]
        L[Tweet Mixer]
        M[FRS Service]
        N[User Entity Graph]
        O[RealTime Graph]
        P[Timeline Service]
        Q[Ads Service]
    end

    subgraph "ML & Feature Layer"
        R[Feature Store]
        S[ML Models]
        T[Scoring Pipelines]
        U[Feature Hydrators]
    end

    subgraph "Data Sources"
        V[Search Index]
        W[User Graph]
        X[Engagement Data]
        Y[RealTime Signals]
        Z[Cache Stores]
    end

    A --> C
    B --> C
    C --> E
    C --> F
    C --> G
    E --> H
    F --> I
    G --> J

    H --> K
    H --> L
    H --> M
    H --> N
    I --> K
    I --> P
    J --> P

    K --> V
    L --> W
    M --> X
    N --> W
    O --> Y
    P --> V

    H --> U
    I --> U
    J --> U
    U --> R
    U --> T
    T --> S

    style A fill:#e3f2fd
    style Z fill:#fff3e0
```

### Product Pipeline Hierarchy

```mermaid
graph TD
    A[Home Mixer Service] --> B[Product Pipeline Registry]

    subgraph "Product Pipelines"
        B --> C[ForYouProductPipeline]
        B --> D[FollowingProductPipeline]
        B --> E[ListTweetsProductPipeline]
        B --> F[SubscribedProductPipeline]
    end

    subgraph "For You Pipeline"
        C --> G[ForYouMixerPipeline]
        G --> H[ForYouScoredTweets]
        G --> I[ForYouAds]
        G --> J[ForYouWhoToFollow]
        G --> K[ForYouConversationService]

        H --> L[ScoredTweetsRecommendation]
        L --> M[Multiple Candidate Pipelines]
    end

    subgraph "Following Pipeline"
        D --> N[FollowingMixerPipeline]
        N --> O[FollowingEarlybird]
        N --> P[FollowingAds]
        N --> Q[FollowingWhoToFollow]
        N --> R[ConversationService]
    end

    subgraph "List Tweets Pipeline"
        E --> S[ListTweetsMixerPipeline]
        S --> T[ListTweetsTimelineService]
        S --> U[ListTweetsAds]
        S --> V[ConversationService]
    end

    style A fill:#ffecb3
    style B fill:#c8e6c9
```

## Core Data Flow

### For You Timeline Data Flow

```mermaid
sequenceDiagram
    participant User as User
    participant Controller as HTTP Controller
    participant Product as ForYouProductPipeline
    participant Mixer as ForYouMixerPipeline
    participant Rec as ScoredTweetsRecommendation
    participant Sources as Candidate Sources
    participant Features as Feature Hydrators
    participant ML as ML Scoring
    participant Filters as Quality Filters
    participant Response as Timeline Response

    User->>Controller: GET /home_timeline
    Controller->>Product: HomeMixerRequest
    Product->>Mixer: ForYouQuery

    Mixer->>Rec: Get Tweet Candidates
    Rec->>Sources: Fetch Candidates

    Sources-->>Rec: Raw Tweet Candidates
    Rec->>Features: Hydrate Features
    Features-->>Rec: 6000+ Features

    Rec->>ML: Score Candidates
    ML-->>Rec: Ranked Scores

    Rec->>Filters: Apply Filters
    Filters-->>Rec: Filtered Candidates

    Rec-->>Mixer: Ranked Tweets

    Mixer->>Sources: Get Ads
    Mixer->>Sources: Get WhoToFollow
    Mixer->>Sources: Get ConversationService

    Mixer->>Mixer: Mix Content
    Mixer-->>Product: Mixed Timeline
    Product-->>Controller: UrtTimelineResponse
    Controller-->>User: JSON Timeline
```

### Feature Hydration Process

```mermaid
flowchart LR
    subgraph "Feature Hydration Pipeline"
        A[Raw Candidates] --> B[Batch Feature Request]
        B --> C[Parallel Feature Extraction]

        C --> D[User Features]
        C --> E[Author Features]
        C --> F[Tweet Features]
        C --> G[RealTime Features]
        C --> H[Historical Features]
        C --> I[Graph Features]
        C --> J[ML Embeddings]

        D --> K[Feature Store]
        E --> K
        F --> K
        G --> K
        H --> K
        I --> K
        J --> K

        K --> L[Feature Vector Assembly]
        L --> M[Feature Validation]
        M --> N[Complete Feature Set]
    end

    style A fill:#e3f2fd
    style N fill:#c8e6c9
```

## Component Interactions

### Candidate Pipeline Architecture

```mermaid
graph TB
    subgraph "Candidate Generation Layer"
        A[InNetwork Pipeline]
        B[OutOfNetwork Pipeline]
        C[FRS Pipeline]
        D[Lists Pipeline]
        E[ContentExploration Pipeline]
        F[RealTime Pipeline]
    end

    subgraph "Candidate Sources"
        G[Earlybird Search]
        H[TweetMixer Service]
        I[FollowRec Service]
        J[User Entity Graph]
        K[RealTime Interaction Graph]
        L[Timeline Service]
        M[Content Store]
    end

    subgraph "Feature Processing"
        N[Feature Hydrators]
        O[Feature Validation]
        P[Feature Transformation]
    end

    A --> G
    A --> H
    B --> J
    B --> K
    C --> I
    D --> L
    E --> M
    F --> K

    A --> N
    B --> N
    C --> N
    D --> N
    E --> N
    F --> N

    N --> O
    O --> P

    style G fill:#fff3e0
    style P fill:#e8f5e8
```

### Real-time Signal Processing

```mermaid
graph LR
    subgraph "Real-time Signal Sources"
        A[User Interactions]
        B[Tweet Engagement]
        C[Follow Events]
        D[RealTime Graph]
        E[Stream Processing]
    end

    subgraph "Signal Processing"
        F[Signal Aggregation]
        G[Time Decay]
        H[Score Normalization]
        I[Feature Extraction]
    end

    subgraph "Integration Points"
        J[Candidate Scoring]
        K[Feature Hydration]
        L[Ranking Models]
        M[Content Filtering]
    end

    A --> F
    B --> F
    C --> F
    D --> F
    E --> F

    F --> G
    G --> H
    H --> I

    I --> J
    I --> K
    I --> L
    I --> M

    style A fill:#ffecb3
    style M fill:#e8f5e8
```

## Scoring and Ranking

### Multi-Stage Scoring Pipeline

```mermaid
graph TD
    A[Raw Candidates] --> B[Initial Filtering]
    B --> C[Heuristic Scoring]
    C --> D[Model-Based Scoring]
    D --> E[Reranking]
    E --> F[Final Ranking]

    subgraph "Heuristic Scoring"
        G[Recency Score]
        H[Engagement Rate]
        I[Author Quality]
        J[Content Quality]
    end

    subgraph "ML Scoring"
        K[HeavyRanker Model]
        L[Neural Networks]
        M[Gradient Boosting]
        N[Embedding Similarity]
    end

    subgraph "Reranking"
        O[Diversity Scoring]
        P[Novelty Scoring]
        Q[Balance Score]
        R[Personalization]
    end

    C --> G
    C --> H
    C --> I
    C --> J

    D --> K
    D --> L
    D --> M
    D --> N

    E --> O
    E --> P
    E --> Q
    E --> R

    style A fill:#e3f2fd
    style F fill:#c8e6c9
```

### Feature Categories and Scoring

```mermaid
pie title Feature Categories in Scoring
    "User Features" : 25
    "Author Features" : 20
    "Tweet Features" : 15
    "Real-time Features" : 15
    "Historical Features" : 10
    "Graph Features" : 10
    "Embedding Features" : 5
```

### Scoring Model Architecture

```mermaid
graph TB
    subgraph "Input Features"
        A[User Features]
        B[Author Features]
        C[Tweet Features]
        D[Context Features]
        E[Time Features]
        F[Graph Features]
    end

    subgraph "Feature Processing"
        G[Feature Normalization]
        H[Feature Selection]
        I[Feature Engineering]
        J[Feature Embedding]
    end

    subgraph "ML Models"
        K[Binary Classification]
        L[Regression Models]
            K1[Logistic Regression]
            K2[Gradient Boosting]
            K3[Neural Networks]
            L1[Engagement Prediction]
            L2[Click-through Rate]
        M[Ensemble Model]
    end

    subgraph "Output Scores"
        N[Relevance Score]
        O[Engagement Score]
        P[Quality Score]
        Q[Final Combined Score]
    end

    A --> G
    B --> G
    C --> G
    D --> G
    E --> G
    F --> G

    G --> H
    H --> I
    I --> J

    J --> K
    J --> L

    K --> K1
    K --> K2
    K --> K3

    L --> L1
    L --> L2

    K1 --> M
    K2 --> M
    K3 --> M
    L1 --> M
    L2 --> M

    M --> N
    M --> O
    M --> P

    N --> Q
    O --> Q
    P --> Q

    style A fill:#e3f2fd
    style Q fill:#c8e6c9
```

## Real-time Processing

### Real-time Data Integration

```mermaid
graph LR
    subgraph "Real-time Data Sources"
        A[User Activity Stream]
        B[Tweet Engagement Stream]
        C[Follow Relationship Stream]
        D[RealTime Graph Updates]
        E[Signal Processing Pipeline]
    end

    subgraph "Real-time Processing"
        F[Stream Processing]
        G[Window Aggregation]
        H[Score Calculation]
        I[Feature Update]
    end

    subgraph "Storage & Cache"
        J[Real-time Feature Store]
        K[Time Series Database]
        L[Cache Layer]
        M[Feature Cache]
    end

    subgraph "Integration"
        N[Candidate Scoring]
        O[Feature Hydration]
        P[Ranking Pipeline]
    end

    A --> F
    B --> F
    C --> F
    D --> F
    E --> F

    F --> G
    G --> H
    H --> I

    I --> J
    I --> K
    I --> L
    I --> M

    J --> N
    K --> O
    L --> P
    M --> P

    style A fill:#ffecb3
    style P fill:#e8f5e8
```

### Real-time Feature Processing Pipeline

```mermaid
flowchart TD
    subgraph "Ingestion"
        A[Kafka Topics]
        B[Stream Processing]
        C[Event Validation]
    end

    subgraph "Processing"
        D[Window Aggregation]
        E[Time Decay Functions]
        F[Score Normalization]
        G[Feature Extraction]
    end

    subgraph "Storage"
        H[Real-time Database]
        I[Feature Cache]
        J[Time Series Store]
    end

    subgraph "Serving"
        K[Feature API]
        L[Candidate Scoring]
        M[Real-time Feedback]
    end

    A --> B
    B --> C
    C --> D

    D --> E
    E --> F
    F --> G

    G --> H
    G --> I
    G --> J

    H --> K
    I --> K
    J --> K

    K --> L
    L --> M

    style A fill:#fff3e0
    style M fill:#e8f5e8
```

## Machine Learning Integration

### ML Model Pipeline Architecture

```mermaid
graph TB
    subgraph "Training Data Sources"
        A[Historical Logs]
        B[User Interactions]
        C[Tweet Features]
        D[Engagement Data]
        E[Real-time Signals]
    end

    subgraph "Data Processing"
        F[Feature Engineering]
        G[Data Cleaning]
        H[Feature Selection]
        I[Label Generation]
    end

    subgraph "Model Training"
        J[Model Selection]
        K[Hyperparameter Tuning]
        L[Cross Validation]
        M[Model Training]
        N[Model Evaluation]
    end

    subgraph "Model Serving"
        O[Model Deployment]
        P[Online Prediction]
        Q[Batch Scoring]
        R[Model Monitoring]
    end

    subgraph "Integration"
        S[Feature Store]
        T[Candidate Scoring]
        U[Real-time Ranking]
    end

    A --> F
    B --> F
    C --> F
    D --> F
    E --> F

    F --> G
    G --> H
    H --> I

    I --> J
    J --> K
    K --> L
    L --> M
    M --> N

    N --> O
    O --> P
    O --> Q
    P --> R

    P --> S
    Q --> S
    S --> T
    S --> U

    style A fill:#e3f2fd
    style U fill:#c8e6c9
```

### Feature Store Integration

```mermaid
graph LR
    subgraph "Feature Sources"
        A[Batch Features]
        B[Real-time Features]
        C[ML Features]
        D[Graph Features]
    end

    subgraph "Feature Store"
        E[Feature Registry]
        F[Feature Storage]
        G[Feature Serving]
        H[Version Management]
    end

    subgraph "Consumers"
        I[Online Scoring]
        J[Offline Training]
        K[Feature Monitoring]
        L[Model Training]
    end

    A --> E
    B --> E
    C --> E
    D --> E

    E --> F
    F --> G
    G --> H

    G --> I
    G --> J
    G --> K
    G --> L

    style A fill:#e3f2fd
    style L fill:#c8e6c9
```

### Model Ensemble Architecture

```mermaid
graph TD
    subgraph "Input Layer"
        A[Raw Features]
        B[Feature Vectors]
        C[Context Data]
    end

    subgraph "Model Ensemble"
        D[HeavyRanker Model]
        E[LightRanker Model]
        F[Neural Network]
        G[Gradient Boosting]
        H[Logistic Regression]
        I[Embedding Models]
    end

    subgraph "Ensemble Methods"
        J[Weighted Average]
        K[Stacking]
        L[Blending]
        M[Voting]
    end

    subgraph "Output Layer"
        N[Relevance Score]
        O[Engagement Score]
        P[Quality Score]
        Q[Final Score]
    end

    A --> D
    A --> E
    A --> F
    A --> G
    A --> H
    A --> I

    D --> J
    E --> J
    F --> J
    G --> J
    H --> J
    I --> J

    J --> K
    K --> L
    L --> M

    M --> N
    M --> O
    M --> P

    N --> Q
    O --> Q
    P --> Q

    style A fill:#e3f2fd
    style Q fill:#c8e6c9
```

This documentation provides a comprehensive overview of the Twitter Home Mixer algorithm architecture, highlighting the complex interplay between various components, real-time processing capabilities, and sophisticated machine learning integration that powers Twitter's home timeline recommendations.