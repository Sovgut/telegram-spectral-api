import { Logger as InternalLogger } from "./logger/class.js";

interface Descriptor<T> {
	value: T;
}

type DescriptorFunction = Descriptor<(...args: unknown[]) => void>;

export namespace Decorators {
	export const Logger = (message: string): MethodDecorator => {
		return function (target, _propertyKey, initialDescriptor) {
			const logger = new InternalLogger(target.constructor.name);
			const descriptor = initialDescriptor as DescriptorFunction;
			const original = descriptor.value;

			if (typeof original !== "function") {
				throw new Error(`Logger decorator can only be applied to methods not: ${typeof original}`);
			}

			descriptor.value = function (...args: unknown[]) {
				logger.log({
					message,
					scope: original.name,
					arguments: args,
				});

				return original.call(this, ...args);
			};
		};
	};
}
