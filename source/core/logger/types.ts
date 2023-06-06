export interface LoggerContext {
	scope: string;
	message: string;

	[key: string]: any;
}
