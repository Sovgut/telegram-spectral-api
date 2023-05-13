export function _extractFilename(value: string) {
    const filename = value.split('/').pop();
    if (!filename) throw new Error('Filename not found in provided value');

    return filename;
} 