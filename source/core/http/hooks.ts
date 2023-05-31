import { Logger } from "~core/logger.js";

export const onServerStart = async (error: Error | null, address: string): Promise<void> => {
  const logger = new Logger();

  if (error !== null) {
    await logger.error({
      scope: "http:hooks:onServerStart",
      message: error?.message,
      exception: error,
    });

    process.exit(1);
  }

  await logger.info({
    scope: "http:hooks:onServerStart",
    message: `Listening on ${address}`,
  });
};
