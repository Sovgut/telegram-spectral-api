import chalk from 'chalk';

export class _Logger {
    constructor(readonly namespace: string) {
    }

    static log(namespace: string, message: unknown) {
        if (process.env.NODE_ENV === 'development') {
            console.log(`[${chalk.gray(namespace)}]`, message);
        }
    }

    log(message: unknown) {
        if (process.env.NODE_ENV === 'development') {
            console.log(`[${chalk.gray(this.namespace)}]`, message);
        }
    }

    static error(namespace: string, message: unknown) {
        console.error(`[${chalk.red(namespace)}]`, message);
    }

    error(message: unknown) {
        console.error(`[${chalk.red(this.namespace)}]`, message);
    }

    static warn(namespace: string, message: unknown) {
        console.warn(`[${chalk.yellow(namespace)}]`, message);
    }

    warn(message: unknown) {
        console.warn(`[${chalk.yellow(this.namespace)}]`, message);
    }

    static info(namespace: string, message: unknown) {
        console.log(`[${chalk.blueBright(namespace)}]`, message);
    }

    info(message: unknown) {
        console.log(`[${chalk.blueBright(this.namespace)}]`, message);
    }
}