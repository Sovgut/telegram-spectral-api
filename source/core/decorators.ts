import { Logger as InternalLogger } from "./logger.js";

export namespace Decorators {
  export const Logger = (message: string): any => {
    const logger = new InternalLogger();

    return function (target: any, _propertyKey: string, descriptor: PropertyDescriptor): any {
      const originalMethod = descriptor.value;
      descriptor.value = async function (...args: any[]) {
        logger.log({
          message,
          scope: `${target.constructor.name as string}:${originalMethod.name as string}`,
          arguments: args,
        });

        return await originalMethod.apply(this, args);
      };
    };
  };
}
