import type internal from "node:stream";

export interface IFileWriteOptions {
    mimeType: string;
    fileName: string;
}

export interface IFilePromiseService {
    read(path: string): Promise<unknown>;
    write(path: string, data: unknown): Promise<unknown>;
    delete(path: string): Promise<unknown>;
}

export interface IFileStreamService {
    read(stream: internal.Writable): Promise<unknown>;
    write(stream: internal.Readable, options?: IFileWriteOptions): Promise<unknown>;
    delete(path: string): Promise<unknown>;
}