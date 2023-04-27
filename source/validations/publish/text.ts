export const PublishTextValidationSchema = {
    body: {
        type: 'object',
        properties: {
            chatId: { type: 'string' },
            text: { type: 'string' },
        },
        required: ['chatId', 'text']
    }
}