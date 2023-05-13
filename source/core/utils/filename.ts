export function getFilenameFromPath(path: string) {
    return path.split('/').pop();
}

export function getFilenameFromUrl(url: string) {
    return url.split('/').pop();
}