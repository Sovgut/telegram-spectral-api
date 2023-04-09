import {StatusCodes} from 'http-status-codes'
import {CONFLICT} from '~core/constants.js'
import {BaseError} from '~core/error/base.js'

export class ConflictError extends BaseError {
    httpStatus: number = StatusCodes.CONFLICT

    constructor (message: string, key: string = CONFLICT) {
        super(message, key)
    }
}
