import {getScreenshot} from "~core/processing/video/get-screenshot.js";
import {getDimensions} from "~core/processing/photo/get-dimensions.js";
import {toThumbnail} from "~core/processing/photo/to-thumbnail.js";
import {LocalStorage} from "~core/local-storage/provider.js";

export async function createThumbnail(inputFilename: string) {
    const screenshot = await getScreenshot(inputFilename);
    const dimensions = await getDimensions(screenshot);
    const thumbnail = await toThumbnail(screenshot, dimensions);

    await LocalStorage.delete(screenshot, LocalStorage.StoragePathType.FileName);

    return {filename: thumbnail, ...dimensions};
}