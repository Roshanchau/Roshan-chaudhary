# AI Voice Portfolio Assistant — Production Architecture Plan

Author: Roshan Chaudhary  
Stack Focus: Realtime Voice AI + RAG + WebRTC + PostgreSQL Vector Search

---

# 1. Project Goal

Build a realtime conversational AI assistant for a portfolio website that can:

- Speak naturally with visitors
- Answer questions about:
  - projects
  - experience
  - skills
  - resume
  - blogs
  - achievements
  - technologies
- Explain technical implementations deeply
- Maintain conversational context
- Respond with low latency
- Stream voice responses in realtime

The assistant should feel like:

> “Talking directly with Roshan.”

---

# 2. Recommended Production Architecture

## Industry Standard Architecture

```txt
User Voice
   ↓
WebRTC Audio Stream
   ↓
Voice Activity Detection (VAD)
   ↓
Streaming Speech-to-Text (Whisper)
   ↓
LLM Orchestrator
   ↓
RAG Retrieval Pipeline
   ↓
Portfolio Knowledge Base
   ↓
LLM Response
   ↓
Streaming Text-to-Speech
   ↓
Realtime Audio Playback
```

This is the current production-standard architecture used in modern realtime AI systems. OpenAI recommends WebRTC for low-latency realtime voice applications. :contentReference[oaicite:0]{index=0}

---

# 3. Recommended Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js + TypeScript |
| Styling | TailwindCSS |
| State Management | Zustand |
| Animation | Framer Motion |
| Audio Transport | WebRTC |
| Backend Framework | Fastify |
| ORM | Prisma |
| Database | PostgreSQL |
| Vector Search | pgvector |
| Cache | Redis |
| STT | Whisper Large V3 Turbo |
| LLM | GPT-4o-mini |
| TTS | Kokoro TTS |
| Observability | Langfuse |
| Deployment | Vercel + Railway |
| Containerization | Docker |

---

# 4. Why PostgreSQL + pgvector

## Recommended Choice

Use:

- PostgreSQL
- pgvector extension

Why this is optimal:

- production-proven
- cheaper than managed vector DBs
- excellent Prisma support
- combines relational + vector search
- easy scaling
- transactional consistency
- simpler infrastructure

Official pgvector repository:

https://github.com/pgvector/pgvector

---

# 5. Recommended Voice Pipeline

## Best Practical Pipeline

```txt
Browser Mic
   ↓
WebRTC Stream
   ↓
Silero VAD
   ↓
Whisper Large V3 Turbo
   ↓
GPT-4o-mini + RAG
   ↓
Kokoro TTS
   ↓
Audio Stream Response
```

---

# 6. Why NOT End-to-End Speech Models

Avoid using fully end-to-end speech-to-speech models for production right now.

Examples:

- SeamlessM4T
- MiniCPM-o
- Ultravox

Why avoid them:

- harder debugging
- weaker RAG integration
- poor observability
- harder tool calling
- infrastructure complexity

The modular architecture remains the most maintainable production approach.

---

# 7. Frontend Architecture

## Frontend Responsibilities

### UI Components

```txt
components/
├── voice/
│   ├── VoiceOrb.tsx
│   ├── AudioVisualizer.tsx
│   ├── MicButton.tsx
│   ├── TranscriptView.tsx
│   └── ConversationPanel.tsx
```

---

## Frontend Features

### Required Features

- realtime streaming
- interruption handling
- animated voice orb
- waveform visualization
- partial transcript rendering
- streaming response text
- reconnect handling
- audio buffering
- session persistence

---

## Recommended Frontend Stack

```txt
Next.js
TypeScript
TailwindCSS
Zustand
Framer Motion
WebRTC
Web Audio API
```

---

# 8. Backend Architecture

## Backend Responsibilities

```txt
Backend API Gateway
│
├── Authentication
├── Rate Limiting
├── WebSocket Gateway
├── Session Management
├── Conversation State
├── RAG Orchestration
├── Tool Calling
└── Streaming Control
```

---

## Recommended Backend Stack

```txt
Fastify
TypeScript
Prisma
Redis
WebSockets
Docker
```

---

# 9. Why Fastify Instead of Express

## Fastify Advantages

- faster performance
- lower overhead
- schema validation
- production plugins
- better TypeScript support
- lower memory usage

---

# 10. Realtime Audio Transport

## Use WebRTC

Do NOT use REST APIs for voice streaming.

Use:

```txt
WebRTC
```

Why:

- ultra-low latency
- bidirectional audio
- echo cancellation
- jitter buffering
- interruption support
- browser-native

OpenAI recommends WebRTC for realtime audio applications. :contentReference[oaicite:1]{index=1}

---

# 11. Voice Activity Detection (VAD)

## Recommended

Use:

```txt
Silero VAD
```

Repository:

https://github.com/snakers4/silero-vad

Purpose:

- detect speech start/end
- reduce silence processing
- reduce hallucinated responses
- improve latency

---

# 12. RAG Architecture

## Core Knowledge Sources

The assistant should ingest:

```txt
- About Page
- Resume
- Skills
- Experience
- Projects
- GitHub Repositories
- Blogs
- FAQs
- Testimonials
- Education
- Certifications
- Achievements
```

---

# 13. RAG Pipeline

```txt
Portfolio Content
      ↓
Content Extraction
      ↓
Chunking
      ↓
Embeddings
      ↓
PostgreSQL + pgvector
      ↓
Semantic Retrieval
      ↓
Context Injection
      ↓
LLM Response
```

---

# 14. Chunking Strategy

## Recommended Settings

```txt
Chunk Size: 400–800 tokens
Overlap: 100 tokens
Chunking Type: Semantic Chunking
```

---

# 15. Embedding Models

## Recommended Open Source

```txt
BAAI/bge-large-en-v1.5
```

Alternative:

```txt
text-embedding-3-small
```

---

# 16. Recommended Database Schema

## PostgreSQL Tables

```sql
users
sessions
messages
documents
document_chunks
embeddings
conversation_memory
analytics
```

---

# 17. Vector Table Example

```sql
CREATE TABLE document_chunks (
    id UUID PRIMARY KEY,
    content TEXT,
    embedding VECTOR(1024),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

# 18. Conversation Memory

## Two-Level Memory System

### Short-Term Memory

Store:

- current conversation
- recent messages
- temporary context

Use:

```txt
Redis
```

---

### Long-Term Memory

Store:

- user preferences
- conversation summaries
- visitor analytics

Use:

```txt
PostgreSQL
```

---

# 19. Streaming Strategy

## Everything Should Stream

### Stream:

- partial transcripts
- LLM tokens
- TTS audio chunks

Why:

- drastically reduces perceived latency
- improves conversational feel
- feels human-like

---

# 20. Interruption Handling

## Critical Feature

The user must be able to interrupt the assistant while it is speaking.

Implementation:

```txt
User Starts Speaking
    ↓
Immediately Stop TTS
    ↓
Flush Audio Queue
    ↓
Resume STT Pipeline
```

---

# 21. Observability

## Recommended Tool

Use:

```txt
Langfuse
```

Track:

- latency
- token usage
- failures
- hallucinations
- retrieval quality
- conversation analytics

Official:

https://langfuse.com

---

# 22. Security Requirements

## Must-Have Security Features

```txt
- rate limiting
- websocket authentication
- API key protection
- prompt injection protection
- request validation
- CORS policies
- abuse prevention
- IP throttling
```

---

# 23. Suggested Monorepo Structure

```txt
apps/
 ├── web/
 └── api/

packages/
 ├── ai/
 ├── rag/
 ├── speech/
 ├── database/
 ├── prompts/
 ├── analytics/
 └── shared/

infra/
 ├── docker/
 ├── terraform/
 └── kubernetes/
```

---

# 24. Docker Architecture

## Services

```txt
frontend
backend
postgres
redis
worker
nginx
```

---

# 25. Deployment Strategy

## Recommended Hosting

### Frontend

```txt
Vercel
```

### Backend

```txt
Railway
or
Fly.io
```

### Database

```txt
Supabase PostgreSQL
```

---

# 26. AI Prompt Design

## Recommended System Prompt

```txt
You are Roshan's AI portfolio assistant.

Your responsibilities:
- answer questions about Roshan
- explain projects deeply
- discuss technical architecture
- help recruiters navigate the portfolio
- explain technologies professionally
- maintain conversational context
- respond naturally and concisely
```

---

# 27. Development Phases

# Phase 1 — MVP

## Features

- voice input
- voice output
- realtime streaming
- portfolio RAG
- contextual responses

---

# Phase 2 — Advanced

## Features

- interruption handling
- analytics
- memory
- multilingual support
- advanced voice synthesis

---

# Phase 3 — Production AI Agent

## Features

- tool calling
- recruiter mode
- lead capture
- calendar integration
- email integration
- GitHub live querying
- dynamic project demos

---

# 28. Performance Targets

| Metric | Target |
|---|---|
| STT Latency | < 300ms |
| Retrieval Latency | < 150ms |
| LLM First Token | < 500ms |
| TTS Start | < 400ms |
| End-to-End Response | < 1.5s |

---

# 29. Recommended Future Improvements

## Advanced Features

```txt
- multilingual voice
- emotion detection
- recruiter personalization
- sentiment analysis
- live GitHub integration
- autonomous project demos
- screen-sharing assistant
```

---

# 30. Final Recommended Stack

| Layer | Final Recommendation |
|---|---|
| Frontend | Next.js + TypeScript |
| Audio Transport | WebRTC |
| STT | Whisper Large V3 Turbo |
| LLM | GPT-4o-mini |
| TTS | Kokoro TTS |
| Vector DB | PostgreSQL + pgvector |
| ORM | Prisma |
| Backend | Fastify |
| Cache | Redis |
| Observability | Langfuse |
| Deployment | Vercel + Railway |

---

# 31. Final Architecture Summary

```txt
Client (Next.js)
    ↓
WebRTC Audio Stream
    ↓
Silero VAD
    ↓
Whisper Streaming STT
    ↓
Fastify AI Gateway
    ↓
RAG Retrieval Layer
    ↓
PostgreSQL + pgvector
    ↓
GPT-4o-mini
    ↓
Streaming TTS
    ↓
Realtime Audio Playback
```

---

# 32. Final Recommendation

This architecture is:

- enterprise-grade
- modular
- scalable
- recruiter-impressive
- low-latency
- production maintainable
- aligned with modern realtime AI systems

It follows the same architectural principles used in modern realtime voice AI applications today. 