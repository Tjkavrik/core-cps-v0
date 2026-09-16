/**
 * Local filesystem StorageProvider — prototype default.
 * Files are written under FILE_UPLOAD_DIR. Not for production use.
 */
import { promises as fs } from "fs";
import * as path from "path";
import type { StorageProvider, StoredObject } from "./index";

export class LocalFilesystemStorage implements StorageProvider {
  constructor(private readonly baseDir: string) {}

  private resolve(relativePath: string): string {
    // Prevent path traversal outside the base directory.
    const full = path.resolve(this.baseDir, relativePath);
    const base = path.resolve(this.baseDir);
    if (!full.startsWith(base)) {
      throw new Error("Invalid storage path");
    }
    return full;
  }

  async put(relativePath: string, data: Buffer): Promise<StoredObject> {
    const full = this.resolve(relativePath);
    await fs.mkdir(path.dirname(full), { recursive: true });
    await fs.writeFile(full, data);
    return { storagePath: relativePath, sizeBytes: data.byteLength };
  }

  async get(storagePath: string): Promise<Buffer> {
    return fs.readFile(this.resolve(storagePath));
  }

  async delete(storagePath: string): Promise<void> {
    await fs.rm(this.resolve(storagePath), { force: true });
  }
}
