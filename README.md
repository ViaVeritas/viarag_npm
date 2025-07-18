# ViaRAG SDK

Minimal JavaScript/TypeScript SDK for interacting with the [ViaRAG API](https://viarag.ai).
Designed for developers building RAG pipelines, chatbots, and AI-native workflows.

---

## 📦 Installation

```bash
npm install viarag
```

---

## 🚀 Quickstart

```typescript
import { ViaRAGClient } from 'viarag';

const client = new ViaRAGClient({
  apiKey: 'your_api_key'
});

// Check API health
console.log(await client.healthCheck());
```

---

## 🔧 Class: `ViaRAGClient`

### `new ViaRAGClient(config: ViaRAGConfig)`

Creates a new client.

```typescript
interface ViaRAGConfig {
  apiKey: string;
  timeout?: number; // Default: 30000ms
}
```

---

## 📡 Endpoints

### ✅ 1. `healthCheck()`

Returns the API's current health status.

```typescript
await client.healthCheck();
```

**Returns:**

```json
{"status": "ok"}
```

---

### 🤖 2. `simpleQuery(prompt: string, topK?: number)`

Runs a **retrieval-augmented generation (RAG)** query.

```typescript
const result = await client.simpleQuery("What is ViaRAG?", 5);
```

**Returns:**

```json
{
  "response": "ViaRAG is an API for retrieval-augmented generation...",
  "contexts": [...],
  "prompt": "..."
}
```

---

### 💬 3. `directQuery(prompt: string)`

Runs a prompt **directly through the LLM**, no retrieval.

```typescript
const result = await client.directQuery("Tell me a joke.");
```

---

### 🔍 4. `matchContext(prompt: string, topK?: number)`

Returns **top-k context chunks** that match your prompt (no generation).

```typescript
const matches = await client.matchContext("What is ViaVeri?", 5);
```

**Returns:**

```json
[
  {"content": "...", "score": 0.92},
  {"content": "...", "score": 0.87}
]
```

---

### 📄 5. `uploadDocument(file, filename, metadata?, chunkingConfig?)`

Uploads a document and indexes it.

```typescript
// Browser
const file = document.getElementById('fileInput').files[0];
await client.uploadDocument(
  file,
  'my_notes.pdf',
  { source: 'user-upload' },
  { chunk_size: 1000, chunk_overlap: 200 }
);

// Node.js
import fs from 'fs';
const buffer = fs.readFileSync('./my_notes.pdf');
await client.uploadDocument(
  buffer,
  'my_notes.pdf',
  { source: 'user-upload' },
  { chunk_size: 1000, chunk_overlap: 200 }
);
```

Supports: `.pdf`, `.docx`, `.txt`

---

### ✂️ 6. `chunkText(text, chunkSize?, chunkOverlap?, splitter?)`

Chunks raw text without uploading a file.

```typescript
const chunks = await client.chunkText("A long string of text...", 1000, 200, 'recursive');
```

**Returns:**

```json
["Chunk 1", "Chunk 2", ...]
```

---

### 📚 7. `listDocuments()`

Lists all documents you've uploaded.

```typescript
const documents = await client.listDocuments();
```

**Returns:**

```json
[
  {"doc_id": "abc123", "filename": "my_notes.pdf"},
  ...
]
```

---

### ❌ 8. `deleteDocumentById(docId: string)`

Deletes all chunks associated with a document.

```typescript
await client.deleteDocumentById("abc123");
```

---

## 🔐 Authentication

All API calls (except `healthCheck`) require a **Bearer token**:

```typescript
const client = new ViaRAGClient({
  apiKey: 'sk-...'
});
```

---

## 🧪 Development

Clone the repo and install dependencies:

```bash
git clone https://github.com/ViaVeritas/viarag_npm.git
cd viarag_npm
npm install
```

Build the package:

```bash
npm run build
```

---

## 📄 License

GNU General Purpose License. See `LICENSE` file.

---

## 👋 About

Built by [ViaVeri Technologies](https://viaveri.co) to empower developers with simple, powerful RAG tools.
