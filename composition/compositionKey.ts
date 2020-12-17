import { InjectionKey } from '@nuxtjs/composition-api'
import { TodoStore } from '~/composition/useTodo'

export const TodoKey: InjectionKey<TodoStore> = Symbol('TodoStore')
