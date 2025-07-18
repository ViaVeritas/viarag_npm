import axios, { AxiosInstance } from 'axios';

export interface ViaRAGConfig {
  apiKey: string;
  timeout?: number;
}

export interface QueryResponse {
  response: string;
  contexts: any[];
  prompt: string;
}

export interface ContextMatch {
  content: string;
  score: number;
}

export interface DocumentInfo {
  doc_id: string;
  filename: string;
}

export interface UploadResponse {
  doc_id: string;
  filename: string;
  message: string;
}

export interface ChunkConfig {
  chunk_size?: number;
  chunk_overlap?: number;
  splitter?: string;
}

export class ViaRAGClient {
  private api: AxiosInstance;
  private apiUrl = 'https://viarag-backend-prod-104241861537.us-central1.run.app';

  constructor(config: ViaRAGConfig) {
    this.api = axios.create({
      baseURL: this.apiUrl,
      timeout: config.timeout || 30000,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Returns API health status
   */
  async healthCheck(): Promise<{ status: string }> {
    const response = await this.api.get('/api/v1/simple/health');
    return response.data;
  }

  /**
   * Runs a retrieval-augmented generation query
   */
  async simpleQuery(prompt: string, topK: number = 5): Promise<QueryResponse> {
    const response = await this.api.post('/api/v1/simple/query/', {
      prompt,
      top_k: topK,
    });
    return response.data;
  }

  /**
   * Runs prompt directly through LLM without retrieval
   */
  async directQuery(prompt: string): Promise<QueryResponse> {
    const response = await this.api.post('/api/v1/simple/query/direct', {
      prompt,
    });
    return response.data;
  }

  /**
   * Retrieves top-k matching context chunks
   */
  async matchContext(prompt: string, topK: number = 5): Promise<ContextMatch[]> {
    const response = await this.api.post('/api/v1/simple/query/match', {
      prompt,
      top_k: topK,
    });
    return response.data;
  }

  /**
   * Uploads and processes a document
   */
  async uploadDocument(
    file: File | Buffer,
    filename: string,
    metadata?: Record<string, any>,
    chunkingConfig?: ChunkConfig
  ): Promise<UploadResponse> {
    const formData = new FormData();
    
    if (file instanceof File) {
      formData.append('file', file);
    } else {
      // For Node.js Buffer
      formData.append('file', new Blob([file]), filename);
    }

    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }

    if (chunkingConfig) {
      formData.append('chunking_config', JSON.stringify(chunkingConfig));
    }

    const response = await this.api.post('/api/v1/simple/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  /**
   * Splits raw text into chunks
   */
  async chunkText(
    text: string,
    chunkSize: number = 1000,
    chunkOverlap: number = 200,
    splitter: string = 'recursive'
  ): Promise<string[]> {
    const response = await this.api.post('/api/v1/simple/chunk', {
      text,
      chunk_size: chunkSize,
      chunk_overlap: chunkOverlap,
      splitter,
    });
    return response.data.chunks;
  }

  /**
   * Lists all uploaded documents
   */
  async listDocuments(): Promise<DocumentInfo[]> {
    const response = await this.api.get('/api/v1/advanced/documents/list');
    return response.data.documents;
  }

  /**
   * Deletes all vectorstore chunks for a document ID
   */
  async deleteDocumentById(docId: string): Promise<{ message: string }> {
    const response = await this.api.post('/api/v1/advanced/delete/delete/by-doc-id', {
      doc_id: docId,
    });
    return response.data;
  }
}

export default ViaRAGClient;