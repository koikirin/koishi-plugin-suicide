import { Context, Schema } from 'koishi'
import { } from '@koishijs/plugin-notifier'

export const name = 'suicide'

export const inject = ['notifier']

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  const suicide = () => ctx.loader.fullReload()

  ctx.notifier.create({
    type: 'danger',
    content: <><p><button onClick={suicide}>RESTART</button></p></>,
  })

  ctx.command('suicide', { authority: 4 }).action(({ session }) => console.log(ctx.$commander.get('!交换', session)))
  console.log(ctx.$commander.get('!交换'))
}
