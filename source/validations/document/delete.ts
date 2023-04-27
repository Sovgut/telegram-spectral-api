export const DocumentDeleteValidationSchema = {
    body: {
        type: 'object',
        properties: {
            url: { type: 'string' },
        },
        required: ['url']
    }
}