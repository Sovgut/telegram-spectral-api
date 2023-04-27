export const PublishAdvertisementValidationSchema = {
    body: {
        type: 'object',
        properties: {
            chatId: { type: 'string' },
            text: { type: 'string' },
            document: { 
                type: 'object',
                properties: {
                    type: { type: 'string' },
                    url: { type: 'string' }
                },
            },
            button: {
                type: 'object',
                properties: {
                    text: { type: 'string' },
                    url: { type: 'string' }
                },
            }
        },
        required: ['chatId', 'text', 'document', 'button']
    }
}