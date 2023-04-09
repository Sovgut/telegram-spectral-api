export const NOT_FOUND = 'NOT_FOUND'
export const INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR'
export const BAD_REQUEST = 'BAD_REQUEST'
export const CONFLICT = 'CONFLICT'

export const LOG_LEVELS = {
    LOG: 0,
    ERROR: 1,
    WARN: 2,
    DEBUG: 3
} as const

export const HIDDEN_HOSTNAME = 'HIDDEN_HOSTNAME'
export const URL_IS_EMPTY_OR_UNDEFINED = 'URL_IS_EMPTY'
export const SECRET_IS_EMPTY_OR_UNDEFINED = 'SECRET_IS_EMPTY'
export const WEBHOOK_NOT_FOUND = 'WEBHOOK_NOT_FOUND'

export const HEADER_AUTH_SECRET_KEY = 'x-auth-secret'