export function extractFilename(url: string) {
    const filename = url.split('/').pop();
    if (!filename) throw new Error('FileName not found');

    return filename;
} 