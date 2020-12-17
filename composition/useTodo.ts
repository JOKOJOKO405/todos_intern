import { reactive } from '@nuxtjs/composition-api'
import { onAuthUIStateChange } from '@aws-amplify/ui-components'
import API, { graphqlOperation } from '@aws-amplify/api'
// 認証系
import { createTodo, deleteTodo, updateTodo } from '~/src/graphql/mutations'
import { listTodos } from '~/src/graphql/queries'
import { onCreateTodo } from '~/src/graphql/subscriptions'

const useTodo = () => {
  // state
  const state = reactive<any>({
    todos: [],
    text: '',
    isEdit: false,
    todoIndex: '',
    newTodo: '',
    sort: 1,
    searchText: '',
  })

  /* ============ ロジック ============ */
  // created
  const created = () => {
    onAuthUIStateChange((authData, authState) => {
      if (authData && authState) {
        getTodo()
        subscribe()
      } else {
        state.todos = []
      }
    })
  }

  // Todo追加
  const addTodo = async () => {
    const todo = {
      name: state.text,
    }
    if (state.text !== '') {
      if (!state.isEdit) {
        await API.graphql(graphqlOperation(createTodo, { input: todo }))
        state.text = ''
      }
    }
  }
  // Todo編集
  const editTodo = async () => {
    const todo = {
      name: state.text,
    }
    // クリックされたtodoのid取得
    const todoId: string = state.todos[state.todoIndex].id
    if (state.text !== '') {
      await API.graphql(
        graphqlOperation(updateTodo, {
          input: {
            id: todoId,
            ...todo,
          },
        })
      )
      state.isEdit = false
    }
  }

  // Todo削除
  const delTodo = async (index: number) => {
    const todoId: string = state.todos[index].id
    await API.graphql(graphqlOperation(deleteTodo, { input: { id: todoId } }))
  }

  // 修正フラグ判定
  const editFlag = (index: number) => {
    state.isEdit = true
    state.text = state.todos[index].name
    state.todoIndex = index
  }

  // フォーム入力値クリア
  const clearText = () => {
    state.text = ''
    state.isEdit = false
  }

  // Todo取得
  const getTodo = async () => {
    const todosData: any = await API.graphql(graphqlOperation(listTodos))
    state.todos.push(...state.todos, ...todosData.data.listTodos.items)
  }

  // サブスクリプション
  const subscribe = async () => {
    const client = await API.graphql(graphqlOperation(onCreateTodo))
    if ('subscribe' in client) {
      client.subscribe({
        next: (eventData: any): void => {
          const todo = eventData.value.data.onCreateTodo
          state.todos = [...state.todos, todo]
        },
      })
    }
  }

  return {
    state,
    created,
    addTodo,
    editTodo,
    delTodo,
    editFlag,
    clearText,
    getTodo,
    subscribe,
  }
}
export default useTodo