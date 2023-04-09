import {StatusCodes} from 'http-status-codes'
import {INTERNAL_SERVER_ERROR} from '~core/constants.js'

export class BaseError extends Error {
    httpStatus: number = StatusCodes.INTERNAL_SERVER_ERROR
    key: string = INTERNAL_SERVER_ERROR

    constructor (message: string, key: string = INTERNAL_SERVER_ERROR) {
        super(message)

        if (key) {
            this.key = key
        }
    }
}
