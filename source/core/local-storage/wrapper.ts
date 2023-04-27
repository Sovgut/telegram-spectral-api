import {LocalStorageProvider} from "~core/local-storage/provider.js";

export class LocalStorageWrapper extends LocalStorageProvider {
    /**
     * Extracts filename from provided url in value argument
     *
     * @param value Url string to extract filename from
     *
     * @returns Filename string
     */
    protected override getFilename(value: string) {
        return value;
    }
}