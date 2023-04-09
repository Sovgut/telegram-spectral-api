import {StatusCodes} from 'http-status-codes'
import {BAD_REQUEST} from '~core/constants.js'
import {BaseError} from '~core/error/base.js'

export class BadRequestError extends BaseError {
    httpStatus: number = StatusCodes.BAD_REQUEST

    constructor (message: string, key: string = BAD_REQUEST) {
        super(message, key)
    }
}
