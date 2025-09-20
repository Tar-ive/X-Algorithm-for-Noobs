# Twitter Home Mixer - Architecture Diagrams

## Overview

This document contains detailed architecture diagrams for the Twitter Home Mixer system, illustrating component relationships, data flows, and deployment patterns.

---

## 1. High-Level System Architecture

### 1.1 Complete System Overview

```mermaid
graph TB
    subgraph "Client Layer"
        C1[Mobile App]
        C2[Web App]
        C3[Third-party Apps]
    end

    subgraph "API Gateway"
        AG[API Gateway<br/>Rate Limiting<br/>Authentication<br/>Load Balancing]
    end

    subgraph "Home Mixer Service"
        HM[Home Mixer Service<br/>Pipeline Orchestration]

        subgraph "Candidate Generation"
            CG1[Follow Graph<br/>Generator]
            CG2[Interest Graph<br/>Generator]
            CG3[Trending<br/>Generator]
            CG4[Search<br/>Generator]
            CG5[Recommended<br/>Generator]
        end

        subgraph "Feature Hydration"
            FH1[User Features<br/>Hydrator]
            FH2[Content Features<br/>Hydrator]
            FH3[Social Features<br/>Hydrator]
            FH4[Temporal Features<br/>Hydrator]
        end

        subgraph "Scoring & Ranking"
            SR1[LightRank<br/>Scorer]
            SR2[HeavyRank<br/>Scorer]
            SR3[Multi-objective<br/>Optimizer]
            SR4[Ranking<br/>Adjuster]
        end

        subgraph "Filtering"
            F1[Quality Filter]
            F2[Safety Filter]
            F3[Diversity Filter]
            F4[Freshness Filter]
        end
    end

    subgraph "Support Services"
        subgraph "Feature Store"
            FS1[Online Feature Store]
            FS2[Offline Feature Store]
            FS3[Feature Cache]
        end

        subgraph "Model Serving"
            MS1[Model Registry]
            MS2[Prediction Service]
            MS3[Model Monitoring]
        end

        subgraph "Real-time Processing"
            RP1[Event Processor]
            RP2[Feature Updater]
            RP3[Model Updater]
        end

        subgraph "User Context"
            UC1[User Profile<br/>Service]
            UC2[Session<br/>Manager]
            UC3[Preference<br/>Manager]
        end
    end

    subgraph "Data Layer"
        subgraph "Content Data"
            CD1[Content Store]
            CD2[Media Store]
            CD3[Index Store]
        end

        subgraph "User Data"
            UD1[User Profile DB]
            UD2[Activity Store]
            UD3[Preference Store]
        end

        subgraph "Social Data"
            SD1[Social Graph DB]
            SD2[Relationship Store]
            SD3[Network Analytics]
        end

        subgraph "Event Data"
            ED1[Event Stream]
            ED2[Event Store]
            ED3[Analytics Store]
        end
    end

    subgraph "External Services"
        ES1[Content Moderation]
        ES2[Trending Service]
        ES3[Search Service]
        ES4[Analytics Service]
    end

    %% Client connections
    C1 --> AG
    C2 --> AG
    C3 --> AG

    %% API Gateway to Home Mixer
    AG --> HM

    %% Home Mixer internal connections
    HM --> CG1
    HM --> CG2
    HM --> CG3
    HM --> CG4
    HM --> CG5

    CG1 --> FH1
    CG2 --> FH2
    CG3 --> FH3
    CG4 --> FH4

    FH1 --> SR1
    FH2 --> SR1
    FH3 --> SR2
    FH4 --> SR2

    SR1 --> SR3
    SR2 --> SR3
    SR3 --> SR4

    SR4 --> F1
    SR4 --> F2
    SR4 --> F3
    SR4 --> F4

    %% Support services connections
    CG1 --> FS1
    CG2 --> FS2
    CG3 --> FS3
    FH1 --> FS1
    FH2 --> FS2
    FH3 --> FS3

    SR1 --> MS1
    SR2 --> MS2
    SR3 --> MS3

    HM --> RP1
    RP1 --> RP2
    RP1 --> RP3

    HM --> UC1
    HM --> UC2
    HM --> UC3

    %% Data layer connections
    CG1 --> SD1
    CG2 --> UD1
    CG3 --> CD1
    CG4 --> CD1

    FH1 --> UD1
    FH2 --> CD1
    FH3 --> SD1

    RP1 --> ED1
    RP2 --> FS1
    RP3 --> MS1

    UC1 --> UD1
    UC2 --> UD2
    UC3 --> UD3

    %% External services connections
    F2 --> ES1
    CG3 --> ES2
    CG4 --> ES3
    HM --> ES4
```

### 1.2 Deployment Architecture

```mermaid
graph TB
    subgraph "Global Load Balancer"
        GLB[Global Load Balancer<br/>DNS-based Routing]
    end

    subgraph "Region: US-East"
        RL1[Regional Load Balancer<br/>SSL Termination]

        subgraph "Availability Zone A"
            GW1[API Gateway<br/>Rate Limiting]
            HM1[Home Mixer<br/>Service]
            FS1[Feature Store<br/>Primary]
            MS1[Model Serving<br/>Primary]
            RP1[Real-time Processor<br/>Primary]
        end

        subgraph "Availability Zone B"
            GW2[API Gateway<br/>Rate Limiting]
            HM2[Home Mixer<br/>Service]
            FS2[Feature Store<br/>Replica]
            MS2[Model Serving<br/>Replica]
            RP2[Real-time Processor<br/>Replica]
        end

        subgraph "Database Cluster"
            DB1[(Primary Database<br/>Content Store)]
            DB2[(Replica Database<br/>User Store)]
            DB3[(Analytics Database<br/>Event Store)]
        end
    end

    subgraph "Region: EU-West"
        RL2[Regional Load Balancer<br/>SSL Termination]

        subgraph "Availability Zone C"
            GW3[API Gateway<br/>Rate Limiting]
            HM3[Home Mixer<br/>Service]
            FS3[Feature Store<br/>Replica]
            MS3[Model Serving<br/>Replica]
            RP3[Real-time Processor<br/>Replica]
        end

        subgraph "Availability Zone D"
            GW4[API Gateway<br/>Rate Limiting]
            HM4[Home Mixer<br/>Service]
            FS4[Feature Store<br/>Replica]
            MS4[Model Serving<br/>Replica]
            RP4[Real-time Processor<br/>Replica]
        end

        subgraph "Database Cluster"
            DB4[(Replica Database<br/>Content Store)]
            DB5[(Replica Database<br/>User Store)]
            DB6[(Analytics Database<br/>Event Store)]
        end
    end

    subgraph "CDN & Edge"
        CDN1[CDN Edge<br/>Static Content]
        CDN2[CDN Edge<br/>Static Content]
    end

    %% Global routing
    GLB --> RL1
    GLB --> RL2

    %% Regional routing
    RL1 --> GW1
    RL1 --> GW2
    RL2 --> GW3
    RL2 --> GW4

    %% Service connections within regions
    GW1 --> HM1
    GW2 --> HM2
    GW3 --> HM3
    GW4 --> HM4

    HM1 --> FS1
    HM1 --> MS1
    HM1 --> RP1
    HM2 --> FS2
    HM2 --> MS2
    HM2 --> RP2
    HM3 --> FS3
    HM3 --> MS3
    HM3 --> RP3
    HM4 --> FS4
    HM4 --> MS4
    HM4 --> RP4

    %% Database connections
    FS1 --> DB1
    FS2 --> DB2
    FS3 --> DB4
    FS4 --> DB5
    RP1 --> DB3
    RP2 --> DB3
    RP3 --> DB6
    RP4 --> DB6

    %% CDN connections
    GLB --> CDN1
    GLB --> CDN2
```

---

## 2. Data Flow Diagrams

### 2.1 Request Processing Pipeline

```mermaid
sequenceDiagram
    participant C as Client
    participant AG as API Gateway
    participant HM as Home Mixer
    participant CG as Candidate Generation
    participant FH as Feature Hydration
    participant SR as Scoring & Ranking
    participant FS as Feature Store
    participant MS as Model Serving
    participant F as Filtering
    participant RT as Real-time Processing

    C->>AG: Home Timeline Request
    Note over AG: Authentication<br/>Rate Limiting<br/>Load Balancing

    AG->>HM: Process Timeline Request
    Note over HM: Request Validation<br/>Context Building

    HM->>CG: Generate Candidates
    Note over CG: Multi-source<br/>Parallel Processing

    par Parallel Candidate Generation
        CG->>FS: Get Follow Graph
        CG->>FS: Get Interest Graph
        CG->>FS: Get Trending Data
        CG->>FS: Get Search Results
    end

    CG-->>HM: 500-1000 Candidates

    HM->>FH: Hydrate Features
    Note over FH: Feature Enrichment<br/>Batch Processing

    par Parallel Feature Hydration
        FH->>FS: Get Real-time Features
        FH->>FS: Get Batch Features
        FH->>RT: Get Stream Features
    end

    FH-->>HM: Hydrated Candidates

    HM->>SR: Score and Rank
    Note over SR: Multi-stage Ranking<br/>ML Models

    SR->>MS: Get LightRank Model
    SR->>MS: Get HeavyRank Model

    MS-->>SR: Model Predictions

    SR->>SR: LightRank Scoring
    SR->>SR: HeavyRank Scoring
    SR->>SR: Multi-objective Optimization

    SR-->>HM: Ranked Candidates

    HM->>F: Apply Filters
    Note over F: Quality & Safety<br/>Diversity Control

    F->>RT: Safety Check
    F->>RT: Quality Check

    RT-->>F: Filter Results

    F-->>HM: Final Candidates

    HM->>AG: Timeline Response
    Note over AG: Response Formatting<br/>Compression

    AG->>C: Timeline Response

    Note over RT: Update User Profile<br/>Update Content Metrics<br/>Update Model Features
```

### 2.2 Real-time Event Processing

```mermaid
sequenceDiagram
    participant U as User
    participant A as App
    participant EC as Event Collector
    participant EP as Event Processor
    participant FU as Feature Updater
    participant FS as Feature Store
    participant MU as Model Updater
    participant MS as Model Serving
    participant HM as Home Mixer

    U->>A: User Action<br/>(Like, Retweet, etc.)

    A->>EC: Send Event
    Note over EC: Event Validation<br/>Batch Collection

    EC->>EP: Process Event
    Note over EP: Event Parsing<br/>Enrichment

    EP->>EP: Categorize Event
    alt Engagement Event
        EP->>FU: Update User Features
        EP->>FU: Update Content Features
        EP->>MU: Update Engagement Model
    else Content Event
        EP->>FU: Update Content Features
        EP->>FU: Update Trending Features
    else Social Event
        EP->>FU: Update Social Features
        EP->>FU: Update Network Features
    else System Event
        EP->>MU: Update System Config
    end

    FU->>FS: Update Online Features
    Note over FS: Real-time Updates<br/>Cache Invalidation

    FS-->>FU: Update Confirmation

    FU->>MU: Trigger Model Update
    Note over MU: Online Learning<br/>Model Retraining

    MU->>MS: Deploy Updated Model
    Note over MS: Model Loading<br/>Version Management

    MS-->>MU: Deployment Confirmation

    MU-->>EP: Processing Complete

    EP-->>EC: Event Processed

    Note over HM: Next Request Will Use<br/>Updated Features & Models
```

### 2.3 Feature Store Architecture

```mermaid
graph TB
    subgraph "Feature Store Clients"
        HM[Home Mixer Service]
        CG[Candidate Generation]
        FH[Feature Hydration]
        SR[Scoring & Ranking]
        RP[Real-time Processor]
    end

    subgraph "Feature Store API"
        API[Feature Store API<br/>Request Routing<br/>Load Balancing]
    end

    subgraph "Cache Layer"
        MC[Memcached<br/>Hot Features]
        RC[Redis<br/>Warm Features]
        LC[Local Cache<br/>Session Features]
    end

    subgraph "Online Store"
        OS1[Online DB 1<br/>User Features]
        OS2[Online DB 2<br/>Content Features]
        OS3[Online DB 3<br/>Social Features]
    end

    subgraph "Offline Store"
        OF1[Data Warehouse<br/>Batch Features]
        OF2[Spark Cluster<br/>Feature Engineering]
        OF3[Hadoop HDFS<br/>Raw Data]
    end

    subgraph "Stream Processing"
        SP1[Kafka Streams<br/>Real-time Features]
        SP2[Flink Cluster<br/>Stream Processing]
        SP3[Event Store<br/>Event Storage]
    end

    subgraph "Feature Registry"
        FR1[Feature Catalog]
        FR2[Metadata Store]
        FR3[Validation Rules]
    end

    %% Client connections
    HM --> API
    CG --> API
    FH --> API
    SR --> API
    RP --> API

    %% API to cache layer
    API --> MC
    API --> RC
    API --> LC

    %% Cache to online store
    MC --> OS1
    RC --> OS2
    LC --> OS3

    %% API to offline store
    API --> OF1
    API --> OF2

    %% Stream processing connections
    SP1 --> API
    SP2 --> OF1
    SP3 --> OF3

    %% Feature registry
    API --> FR1
    API --> FR2
    API --> FR3

    %% Real-time updates
    SP1 --> MC
    SP2 --> RC
```

---

## 3. Component Interaction Diagrams

### 3.1 Microservice Communication

```mermaid
graph LR
    subgraph "Home Mixer Core"
        HMS[Home Mixer Service<br/>gRPC/REST]
    end

    subgraph "Candidate Generation Services"
        FGS[Follow Graph Service<br/>gRPC]
        IGS[Interest Graph Service<br/>gRPC]
        TGS[Trending Service<br/>gRPC]
        SGS[Search Service<br/>REST]
    end

    subgraph "Feature Services"
        UFS[User Feature Service<br/>gRPC]
        CFS[Content Feature Service<br/>gRPC]
        SFS[Social Feature Service<br/>gRPC]
        TFS[Temporal Feature Service<br/>gRPC]
    end

    subgraph "ML Services"
        LRS[LightRank Service<br/>gRPC]
        HRS[HeavyRank Service<br/>gRPC]
        MOS[Multi-objective Service<br/>gRPC]
    end

    subgraph "Infrastructure Services"
        FS[Feature Store<br/>gRPC/Redis]
        MS[Model Serving<br/>TensorFlow Serving]
        CS[Cache Service<br/>Memcached]
        QS[Queue Service<br/>Kafka]
    end

    subgraph "Data Services"
        UDS[User Data Service<br/>gRPC]
        CDS[Content Data Service<br/>gRPC]
        SDS[Social Data Service<br/>gRPC]
    end

    %% Core service connections
    HMS --> FGS
    HMS --> IGS
    HMS --> TGS
    HMS --> SGS

    HMS --> UFS
    HMS --> CFS
    HMS --> SFS
    HMS --> TFS

    HMS --> LRS
    HMS --> HRS
    HMS --> MOS

    %% Service dependencies
    FGS --> UDS
    FGS --> SDS
    IGS --> UDS
    TGS --> CDS
    SGS --> CDS

    UFS --> FS
    UFS --> UDS
    CFS --> FS
    CFS --> CDS
    SFS --> FS
    SFS --> SDS
    TFS --> FS

    LRS --> MS
    LRS --> CS
    HRS --> MS
    HRS --> CS
    MOS --> MS

    %% Infrastructure dependencies
    FS --> CS
    MS --> CS
    QS --> FS
    QS --> MS
```

### 3.2 Data Pipeline Architecture

```mermaid
graph TB
    subgraph "Data Sources"
        U1[User Actions<br/>Mobile/Web]
        U2[Content Creation<br/>Tweet Service]
        U3[Social Actions<br/>Follow Service]
        U4[System Events<br/>Monitoring]
    end

    subgraph "Event Collection"
        EC1[Event Collector 1]
        EC2[Event Collector 2]
        EC3[Event Collector 3]
        EB[Kafka Event Bus]
    end

    subgraph "Stream Processing"
        SP1[Flink Stream Processing]
        SP2[Real-time Aggregation]
        SP3[Feature Engineering]
        SP4[Model Training]
    end

    subgraph "Batch Processing"
        BP1[Spark Batch Jobs]
        BP2[Feature Engineering]
        BP3[Model Training]
        BP4[Analytics]
    end

    subgraph "Storage Layer"
        S1[Real-time Store<br/>Cassandra]
        S2[Batch Store<br/>S3]
        S3[Analytics Store<br/>Redshift]
        S4[Model Store<br/>MLflow]
    end

    subgraph "Serving Layer"
        SV1[Feature Store API]
        SV2[Model Serving API]
        SV3[Analytics API]
    end

    subgraph "Applications"
        A1[Home Mixer]
        A2[Recommendation Engine]
        A3[Analytics Dashboard]
    end

    %% Data flow
    U1 --> EC1
    U2 --> EC2
    U3 --> EC3
    U4 --> EC1

    EC1 --> EB
    EC2 --> EB
    EC3 --> EB

    %% Stream processing
    EB --> SP1
    EB --> SP2
    SP1 --> SP3
    SP2 --> SP3
    SP3 --> SP4

    %% Batch processing
    EB --> BP1
    S2 --> BP2
    S2 --> BP3
    S2 --> BP4

    %% Storage
    SP1 --> S1
    SP3 --> S1
    SP4 --> S4
    BP1 --> S2
    BP2 --> S2
    BP3 --> S4
    BP4 --> S3

    %% Serving layer
    S1 --> SV1
    S4 --> SV2
    S3 --> SV3

    %% Applications
    SV1 --> A1
    SV1 --> A2
    SV2 --> A1
    SV2 --> A2
    SV3 --> A3
```

### 3.3 High Availability Architecture

```mermaid
graph TB
    subgraph "Global Infrastructure"
        GLB[Global Load Balancer]
        CDN[CDN Network]
    end

    subgraph "Primary Region"
        RL1[Regional Load Balancer]

        subgraph "Primary Cluster"
            GW1[API Gateway]
            HM1[Home Mixer Service]
            CG1[Candidate Generation]
            FH1[Feature Hydration]
            SR1[Scoring & Ranking]

            DB1[(Primary Database)]
            CACHE1[Redis Cache]
            QUEUE1[Kafka Queue]
        end

        subgraph "Secondary Cluster"
            GW2[API Gateway]
            HM2[Home Mixer Service]
            CG2[Candidate Generation]
            FH2[Feature Hydration]
            SR2[Scoring & Ranking]

            DB2[(Secondary Database)]
            CACHE2[Redis Cache]
            QUEUE2[Kafka Queue]
        end
    end

    subgraph "Backup Region"
        RL2[Regional Load Balancer]

        subgraph "Disaster Recovery"
            GW3[API Gateway]
            HM3[Home Mixer Service]
            CG3[Candidate Generation]
            FH3[Feature Hydration]
            SR3[Scoring & Ranking]

            DB3[(Backup Database)]
            CACHE3[Redis Cache]
            QUEUE3[Kafka Queue]
        end
    end

    subgraph "Monitoring & Alerting"
        MON[Monitoring System]
        ALT[Alerting System]
        LOG[Logging System]
    end

    %% Global routing
    GLB --> RL1
    GLB --> CDN

    %% Primary region routing
    RL1 --> GW1
    RL1 --> GW2

    %% Primary cluster connections
    GW1 --> HM1
    HM1 --> CG1
    HM1 --> FH1
    HM1 --> SR1
    CG1 --> DB1
    FH1 --> CACHE1
    SR1 --> QUEUE1

    %% Secondary cluster connections
    GW2 --> HM2
    HM2 --> CG2
    HM2 --> FH2
    HM2 --> SR2
    CG2 --> DB2
    FH2 --> CACHE2
    SR2 --> QUEUE2

    %% Database replication
    DB1 --> DB2
    DB1 --> DB3

    %% Cache synchronization
    CACHE1 --> CACHE2
    CACHE1 --> CACHE3

    %% Queue replication
    QUEUE1 --> QUEUE2
    QUEUE1 --> QUEUE3

    %% Backup region (cold standby)
    RL2 --> GW3
    GW3 --> HM3
    HM3 --> CG3
    HM3 --> FH3
    HM3 --> SR3
    CG3 --> DB3
    FH3 --> CACHE3
    SR3 --> QUEUE3

    %% Monitoring
    GW1 --> MON
    GW2 --> MON
    GW3 --> MON
    DB1 --> MON
    DB2 --> MON
    QUEUE1 --> MON
    QUEUE2 --> MON

    MON --> ALT
    MON --> LOG
```

---

## 4. Performance Optimization Architecture

### 4.1 Caching Strategy

```mermaid
graph TB
    subgraph "Client Layer"
        C1[Mobile App<br/>Local Cache]
        C2[Web App<br/>Browser Cache]
    end

    subgraph "Edge Layer"
        E1[CDN Edge<br/>Static Content]
        E2[Edge Cache<br/>Dynamic Content]
    end

    subgraph "Application Layer"
        subgraph "Home Mixer"
            HM[Home Mixer Service]
            LC1[Local Cache<br/>L1 Cache]
        end

        subgraph "Cache Services"
            MC1[Memcached Cluster<br/>L2 Cache]
            RC1[Redis Cluster<br/>L3 Cache]
        end
    end

    subgraph "Data Layer"
        subgraph "Feature Store"
            FS1[Online Feature Store<br/>Database]
            FS2[Offline Feature Store<br/>Data Warehouse]
        end

        subgraph "Cache Storage"
            CS1[Redis Cache<br/>Hot Data]
            CS2[Memcached<br/>Warm Data]
        end
    end

    subgraph "Cache Management"
        CM1[Cache Manager]
        CM2[Cache Invalidation]
        CM3[Cache Analytics]
    end

    %% Client to edge
    C1 --> E1
    C2 --> E2

    %% Edge to application
    E1 --> HM
    E2 --> HM

    %% Application caching
    HM --> LC1
    LC1 --> MC1
    MC1 --> RC1
    RC1 --> CS1
    CS1 --> CS2

    %% Data layer
    CS1 --> FS1
    CS2 --> FS2

    %% Cache management
    CM1 --> LC1
    CM1 --> MC1
    CM1 --> RC1
    CM1 --> CS1
    CM1 --> CS2

    CM2 --> LC1
    CM2 --> MC1
    CM2 --> RC1
    CM2 --> CS1
    CM2 --> CS2

    CM3 --> LC1
    CM3 --> MC1
    CM3 --> RC1
    CM3 --> CS1
    CM3 --> CS2
```

### 4.2 Scalability Architecture

```mermaid
graph TB
    subgraph "Load Balancing"
        LB1[Global Load Balancer]
        LB2[Regional Load Balancer]
        LB3[Service Load Balancer]
    end

    subgraph "Auto Scaling"
        AS1[Horizontal Pod Autoscaler]
        AS2[Vertical Pod Autoscaler]
        AS3[Cluster Autoscaler]
    end

    subgraph "Service Mesh"
        SM1[Istio Service Mesh]
        SM2[Envoy Sidecars]
        SM3[Traffic Management]
    end

    subgraph "Container Orchestration"
        CO1[Kubernetes Cluster]
        CO2[Node Pools]
        CO3[Pod Management]
    end

    subgraph "Resource Management"
        RM1[Resource Quotas]
        RM2[Limit Ranges]
        RM3[Resource Monitoring]
    end

    subgraph "Performance Monitoring"
        PM1[Metrics Collection]
        PM2[Performance Analytics]
        PM3[Auto Scaling Triggers]
    end

    %% Load balancing chain
    LB1 --> LB2
    LB2 --> LB3

    %% Auto scaling integration
    AS1 --> CO1
    AS2 --> CO1
    AS3 --> CO1

    %% Service mesh
    SM1 --> SM2
    SM2 --> SM3
    SM3 --> LB3

    %% Container orchestration
    CO1 --> CO2
    CO2 --> CO3

    %% Resource management
    RM1 --> CO1
    RM2 --> CO1
    RM3 --> CO1

    %% Performance monitoring
    PM1 --> RM3
    PM2 --> AS1
    PM3 --> AS1
```

---

## Conclusion

These architecture diagrams provide a comprehensive view of the Twitter Home Mixer system, illustrating:

1. **System Architecture**: High-level overview of all components and their relationships
2. **Data Flow**: How data moves through the system from request to response
3. **Component Interactions**: How services communicate and coordinate
4. **Deployment Patterns**: How the system is deployed across regions and availability zones
5. **Performance Optimization**: Caching, scaling, and monitoring strategies

The architecture is designed to be:
- **Scalable**: Horizontally scalable to handle millions of requests
- **Resilient**: Fault-tolerant with multiple levels of redundancy
- **Performant**: Low-latency with optimized data flows
- **Maintainable**: Modular design with clear separation of concerns
- **Monitorable**: Comprehensive monitoring and observability

These diagrams serve as a reference for understanding the system architecture and guiding implementation and operational decisions.