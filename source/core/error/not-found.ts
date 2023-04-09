import {StatusCodes} from 'http-status-codes'
import {NOT_FOUND} from '~core/constants.js'
import {BaseError} from '~core/error/base.js'

export class NotFoundError extends BaseError {
    httpStatus: number = StatusCodes.NOT_FOUND

    constructor (message: string, key: string = NOT_FOUND) {
        super(message, key)
    }
}
