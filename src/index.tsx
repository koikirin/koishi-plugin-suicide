import { Awaitable, Context, Schema, Service } from 'koishi'
import { } from '@koishijs/plugin-notifier'

declare module 'koishi' {
  interface Events {
    'shutdown'(): Awaitable<void>
  }

  interface Context {
    shutdown: ShutdownService
  }
}

export interface ShutdownService {
  (): Awaitable<void>
}

export class ShutdownService extends Service {
  constructor(ctx: Context) {
    super(ctx, 'shutdown')

    const suicide = () => ctx.loader.fullReload()
    const shutdown = () => this()

    ctx.notifier.create({
      type: 'danger',
      content: <><p><button onClick={suicide}>RESTART</button></p></>,
    })

    ctx.notifier.create({
      type: 'danger',
      content: <><p><button onClick={shutdown}>SHUTDOWN</button></p></>,
    })

    ctx.command('suicide', { authority: 4 }).action(suicide)
    ctx.command('suicide.shutdown', { authority: 4 }).action(shutdown)
  }

  async notify() {
    return this.ctx.parallel('shutdown')
  }

  async [Service.invoke]() {
    await this.notify()
    this.ctx.get('loader').fullReload()
  }
}

export namespace ShutdownService {
  export const inject = ['notifier']

  export interface Config {}

  export const Config: Schema<Config> = Schema.object({})
}

export default ShutdownService
