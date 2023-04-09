import {Config} from '~core/config.js'
import {onRouterListen} from '~core/events.js'
import {Logger} from '~core/logger.js'
import {router} from '~router'

export class Application {
    static #logger = new Logger('Application')
    static router: ReturnType<typeof router.listen>

    static {
        Application.#logger.debug('started')
        Application.router = router.listen(Config.ApplicationPort, onRouterListen)
    }
}
