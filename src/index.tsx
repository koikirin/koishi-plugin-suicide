import { Awaitable, Context, Schema, Service } from 'koishi'
import { } from '@koishijs/plugin-notifier'

declare module 'koishi' {
  interface Events {
    'shutdown'(): Awaitable<void>
    'resurrect'(): Awaitable<void>
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

    ctx.notifier.create({
      type: 'danger',
      content: <><p>
        <button onClick={suicide}>SUICIDE</button>
        <button onClick={() => this()}>RESTART</button>
      </p></>,
    })

    ctx.notifier.create({
      type: 'primary',
      content: <><p>
        <button onClick={() => this.shutdown()}>SHUTDOWN</button>
        <button onClick={() => this.resurrect()}>RESURRECT</button>
      </p></>,
    })

    ctx.command('suicide', { authority: 4 }).action(suicide)
    ctx.command('suicide.restart', { authority: 4 }).action(() => this())
    ctx.command('suicide.shutdown', { authority: 4 }).action(() => this.shutdown())
    ctx.command('suicide.resurrect', { authority: 4 }).action(() => this.resurrect())
  }

  async resurrect() {
    return this.ctx.parallel('resurrect')
  }

  async shutdown() {
    return this.ctx.parallel('shutdown')
  }

  async [Service.invoke]() {
    await this.shutdown()
    this.ctx.get('loader').fullReload()
  }
}

export namespace ShutdownService {
  export const inject = ['notifier']

  export interface Config {}

  export const Config: Schema<Config> = Schema.object({})
}

export default ShutdownService
