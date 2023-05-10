import {LocalStorageProvider} from "~core/local-storage/provider.js";
import {extractFilename} from "~core/utils/extract-filename.js";

export class LocalStorageWrapper extends LocalStorageProvider {
    /**
     * Extracts filename from provided url in value argument
     *
     * @param value Url string to extract filename from
     *
     * @returns Filename string
     */
    protected override getFilename(value: string) {
        return extractFilename(value);
    }
}