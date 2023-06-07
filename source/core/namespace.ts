import * as _Constants from "./constants.js";
import path from "node:path";
import url from "node:url";
import fs from "node:fs";

export namespace Core {
	export const Constants = _Constants;

	export namespace Utils {
		let appInfo: { name: string; version: string } | undefined;

		/**
		 * Get application name and version from package.json
		 *
		 * @returns Application name and version
		 * @throws Error if package.json not found
		 * @throws Error if package.json is invalid
		 */
		export const getAppInfo = (): { name: string; version: string } | never => {
			if (appInfo !== undefined) {
				return appInfo;
			}

			const path = Core.Utils.rootPath("package.json");
			const data = fs.readFileSync(path, "utf-8");

			return (appInfo = JSON.parse(data));
		};

		/**
		 * Extract filename from path to file or url
		 *
		 * @param value Path to file or url
		 * @returns Filename
		 */
		export const extractFilename = (value: string): string | never => {
			const filename = value.split("/").pop();

			if (typeof filename !== "string") {
				throw new Error("Filename not found in provided value");
			}

			return filename;
		};

		/**
		 * Partially copy object without undefined values
		 *
		 * @param target Object to copy
		 * @returns Partially copied object
		 */
		export const partial = (target: any): Partial<any> => {
			const result: any = {};

			for (const key in target) {
				if (target[key] !== undefined) {
					result[key] = target[key];
				}
			}

			return result;
		};

		/**
		 * Resolve path to file in project from root directory
		 *
		 * @param filepath Path to file from root directory
		 * @returns Absolute path to file from root directory
		 */
		export const rootPath = (filepath: string): string => {
			return path.join(path.dirname(url.fileURLToPath(import.meta.url)), "../..", filepath);
		};

		/**
		 * Check if provided mime type is video
		 *
		 * @param mimeType Mime type
		 * @returns True if mime type is video
		 */
		export const isVideo = (mimeType: string): boolean => {
			return mimeType.includes("video");
		};

		/**
		 * Check if provided mime type is photo
		 *
		 * @param mimeType Mime type
		 * @returns True if mime type is photo
		 */
		export const isPhoto = (mimeType: string): boolean => {
			return mimeType.includes("image");
		};

		/**
		 * Get document type by mime type
		 *
		 * @param mimeType Mime type
		 * @returns Document type (photo or video)
		 */
		export const getDocumentType = (mimeType: string): "photo" | "video" => {
			if (Core.Utils.isPhoto(mimeType)) {
				return "photo";
			}

			return "video";
		};
	}
}
