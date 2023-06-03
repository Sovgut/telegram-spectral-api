import { Logger as InternalLogger } from "./logger.js";

interface Descriptor<T> {
	value: T;
}

type DescriptorFunction = Descriptor<(...args: unknown[]) => Promise<void>>;

export namespace Decorators {
	export const Logger = (message: string): MethodDecorator => {
		const logger = new InternalLogger();

		return function (target, _propertyKey, initialDescriptor) {
			const descriptor = initialDescriptor as DescriptorFunction;
			const original = descriptor.value;

			if (typeof original !== "function") {
				throw new Error(`Logger decorator can only be applied to methods not: ${typeof original}`);
			}

			descriptor.value = async function (...args: unknown[]) {
				logger.log({
					message,
					scope: `${target.constructor.name}:${original.name}`,
					arguments: args,
				});

				return await original.apply(this, args);
			};
		};
	};
}
