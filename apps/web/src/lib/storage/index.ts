/**
 * Storage abstraction — portability boundary.
 *
 * Business/application code MUST depend only on the StorageProvider interface,
 * never on a concrete storage backend. For the prototype we use the local
 * filesystem. In production this can be swapped for S3, Azure Blob, etc. by
 * configuration (see docs/architecture.md — File handling, ADR-005).
 *
 * IMPORTANT: No Abacus-specific storage API is used anywhere in this app.
 */

export interface StoredObject {
  storagePath: string;
  sizeBytes: number;
}

export interface StorageProvider {
  /** Persist bytes and return the relative storage path + size. */
  put(relativePath: string, data: Buffer, contentType: string): Promise<StoredObject>;
  /** Read bytes for a stored object. */
  get(storagePath: string): Promise<Buffer>;
  /** Remove a stored object. */
  delete(storagePath: string): Promise<void>;
}

import { LocalFilesystemStorage } from "./local";

let provider: StorageProvider | null = null;

/**
 * Factory selects the provider from env (FILE_UPLOAD_PROVIDER). Defaults to
 * local filesystem for the prototype. Add S3/Azure implementations here.
 */
export function getStorageProvider(): StorageProvider {
  if (provider) return provider;
  const kind = process.env.FILE_UPLOAD_PROVIDER ?? "local";
  switch (kind) {
    case "local":
      provider = new LocalFilesystemStorage(process.env.FILE_UPLOAD_DIR ?? "./uploads");
      break;
    // case "s3":  provider = new S3Storage(...); break;   // future
    // case "azure": provider = new AzureBlobStorage(...); break; // future
    default:
      throw new Error(`Unknown FILE_UPLOAD_PROVIDER: ${kind}`);
  }
  return provider;
}
