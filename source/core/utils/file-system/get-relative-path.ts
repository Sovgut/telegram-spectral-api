import path from 'node:path'
import {getCurrentDirectory} from '~core/utils/file-system/get-current-directory.js'

/**
 * Get the relative path of a file from the current directory of the file that called this function.
 *
 * @param url The URL of the file that called this function.
 * @param segmentsAndPath The number of segments to go up and the path of the file.
 *
 * @example
 * // If the file that called this function is in the directory `source/core/utils/file-system/`
 * // and the file we want to get the path of is in the directory `source/core/`
 * getRelativeFilePath(import.meta.url, '2|core')
 */
export function getRelativeFilePath (url: string, segmentsAndPath: `${number}|${string}`) {
    const currentDirectory = getCurrentDirectory(url)
    const [directorySegments, file] = segmentsAndPath.split('|')

    return path.join(currentDirectory, ...Array(Number(directorySegments)).fill('..'), file)
}
