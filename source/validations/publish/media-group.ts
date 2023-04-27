export const PublishMediaGroupValidationSchema = {
    body: {
        type: 'object',
        properties: {
            chatId: { type: 'string' },
            text: { type: 'string' },
            documents: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        type: { type: 'string' },
                        url: { type: 'string' }
                    },
                },
            },
        },
        required: ['chatId', 'text', 'documents']
    }
}