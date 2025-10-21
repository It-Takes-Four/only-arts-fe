# OnlyArts User Flow Diagram

## Overview
OnlyArts is a Web3-native platform for digital artists to mint, manage, and monetize their work using blockchain technology. This document outlines three key user flows.

## 1. User Register as Artist & Connect Wallet

```mermaid
graph TD
    A[Landing Page] --> B{User Status?}
    B -->|New User| C[Register Page]
    B -->|Existing User| D[Login Page]
    B -->|Authenticated| E[Home Page]
    
    C --> C1[Registration Form]
    C1 --> C2[Welcome Page]
    
    D --> D1[Login Form]
    D1 --> C2
    
    C2 --> E[Home Page]
    E --> F[Become Artist Page]
    F --> G[Artist Agreement Page]
    G --> H[Artist Registration Form]
    H --> I[Success Page]
    I --> J[Artist Studio]
    J --> K[Wallet Management Modal]
    K --> L[Connect Wallet]
    L --> M[Wallet Connected]
    M --> N[Artist Studio Dashboard]
```

## 2. Artist Create & Manage Collection and Upload Artwork

```mermaid
graph TD
    A[Artist Studio] --> B[Collections Tab]
    A --> C[Artworks Tab]
    
    B --> D[Create Collection Modal]
    D --> E[Collection Details Form]
    E --> F[Set Price & Cover]
    F --> G[Save Collection]
    G --> H[Collection Created]
    
    B --> I[Edit Collection Modal]
    I --> J[Update Collection Details]
    J --> K[Save Changes]
    
    B --> L[Publish Collection]
    L --> M[Collection Published]
    
    C --> N[Create Artwork Modal]
    N --> O[Upload Image]
    O --> P[Add Title & Description]
    P --> Q[Select Tags]
    Q --> R[Save Artwork]
    R --> S[Artwork Created]
    
    C --> T[Edit Artwork Modal]
    T --> U[Update Artwork Details]
    U --> V[Save Changes]
    
    C --> W[Add to Collection]
    W --> X[Select Collection]
    X --> Y[Artwork Added to Collection]
```

## 3. User Buy Collection and View Purchased Collections

```mermaid
graph TD
    A[Home Page] --> B[Explore Page]
    B --> C[Collection Page]
    C --> D[Collection Details]
    D --> E[Purchase Button]
    E --> F[Wallet Connection]
    F --> G[Payment Processing]
    G --> H[Purchase Success]
    H --> I[Collection Added to Library]
    
    A --> J[My Collections Page]
    J --> K[Purchased Collections List]
    K --> L[View Collection Details]
    L --> M[Download Artworks]
    L --> N[View Individual Artworks]
    N --> O[Artwork Details]
    
    A --> P[Search Page]
    P --> Q[Search Results]
    Q --> C
```
