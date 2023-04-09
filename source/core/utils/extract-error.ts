import {StatusCodes} from 'http-status-codes'
import {INTERNAL_SERVER_ERROR} from '~core/constants.js'
import {BaseError} from '~core/error/base.js'

interface ExtractedErrorFields {
    httpStatus: number
    key: string
}

/**
 * Extract fields from base error class.
 *
 * Default to 500 status code and 'Internal server error' message.
 * Default to 'INTERNAL_SERVER_ERROR' key.
 */
export function extractError (error: unknown): ExtractedErrorFields {
    let httpStatus = StatusCodes.INTERNAL_SERVER_ERROR
    let key = INTERNAL_SERVER_ERROR

    if (error instanceof BaseError) {
        httpStatus = (error as BaseError).httpStatus || StatusCodes.INTERNAL_SERVER_ERROR
        key = (error as BaseError).key || INTERNAL_SERVER_ERROR
    }

    return {httpStatus, key}
}
