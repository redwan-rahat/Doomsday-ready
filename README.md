%%{init: {
  "theme": "dark",
  "themeVariables": {
    "background": "#0B0B0D",
    "primaryColor": "#1A1A1E",
    "primaryTextColor": "#F5F5F5",
    "primaryBorderColor": "#F0444A",
    "lineColor": "#F0444A",
    "secondaryColor": "#151518",
    "tertiaryColor": "#222226",
    "textColor": "#F5F5F5",
    "fontFamily": "Arial"
  }
}}%%

erDiagram
    MOVIES {
        ObjectId _id PK
        string title UK
        date releaseDate
        number runtime
        ObjectId[] prerequisites
        boolean watched
    }

    CINEMAS {
        ObjectId _id PK
        string name UK
        number[] bundleSizes
    }

    MOVIES ||--o{ MOVIES : prerequisites

    style MOVIES fill:#151518,stroke:#F0444A,color:#F5F5F5
    style CINEMAS fill:#151518,stroke:#F0444A,color:#F5F5F5