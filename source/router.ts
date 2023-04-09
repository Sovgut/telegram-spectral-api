import cors from 'cors'
import express from 'express'
import {WebhookController} from '~controller/webhook.js'
import {authorizationMiddleware} from '~middleware/authorization.js'
import {errorMiddleware} from '~middleware/error.js'
import {notFoundMiddleware} from '~middleware/not-found.js'
import {WebhookValidator} from '~validator/webhook.js'

export const router = express()

router.use(cors())
router.use(express.json())

router.use(errorMiddleware)
router.use(notFoundMiddleware)

router.post('/api/webhook', authorizationMiddleware, WebhookValidator.createWebhook, WebhookController.createWebhook)
router.get('/api/webhook', authorizationMiddleware, WebhookValidator.getWebhook, WebhookController.getWebhook)
