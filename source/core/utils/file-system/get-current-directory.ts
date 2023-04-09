import nodeUrl from 'node:url'

/**
 * Get the current directory of the file that called this function.
 *
 * @param url The URL of the file that called this function.
 *
 * @example
 * // If the file that called this function is in the directory `source/core/utils/file-system/`
 * getCurrentDirectory(import.meta.url)
 */
export function getCurrentDirectory (url: string) {
    return nodeUrl.fileURLToPath(url)
}
