import path from 'node:path'
import url from 'node:url'

/**
 * Resolve path to file in project from root directory
 */
export function rootPath(filepath: string) {
    return path.join(path.dirname(url.fileURLToPath(import.meta.url)), '../../..', filepath);
}