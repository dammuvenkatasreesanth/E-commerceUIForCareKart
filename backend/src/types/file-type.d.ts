// `file-type` ships as ESM-only with a package.json "exports" map that
// classic ("Node") TS module resolution can't read type declarations
// through. It's consumed via a dynamic import() at runtime (the supported
// way to use an ESM package from this CommonJS backend), so this ambient
// declaration covers just the one export actually used.
declare module "file-type" {
  export interface FileTypeResult {
    ext: string;
    mime: string;
  }

  export function fileTypeFromBuffer(buffer: Uint8Array | ArrayBuffer): Promise<FileTypeResult | undefined>;
}
