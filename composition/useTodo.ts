import { reactive } from '@nuxtjs/composition-api'
import { Auth } from 'aws-amplify'
import API, { graphqlOperation } from '@aws-amplify/api'
// 認証系
import { createTodo, updateTodo, deleteTodo } from '~/src/graphql/mutations'
import { listTodos } from '~/src/graphql/queries'
import {
  onCreateTodo,
  onUpdateTodo,
  onDeleteTodo,
} from '~/src/graphql/subscriptions'

const useTodo = () => {
  // state
  const state = reactive<any>({
    todos: [],
    text: '',
    isEdit: false,
    todoIndex: '',
    sort: 1,
    searchText: '',
    user: null,
    name: '',
    pass: '',
  })

  /* ============ ロジック ============ */
  // サインイン
  const signIn = async () => {
    try {
      const userData = await Auth.signIn(state.name, state.pass)
      state.user = userData.username
      window.$nuxt.$router.push('/todo')
    } catch (error) {
      console.log('error signing in', error)
    }
  }

  // 認証

  // サインアウト
  const signOut = async () => {
    try {
      await Auth.signOut()
      state.user = null
      window.$nuxt.$router.push('/')
    } catch (error) {
      console.log('error signing out: ', error)
    }
  }

  // const created = async () => {
  //   await onAuthUIStateChange((authData, authState) => {
  //     if (authData && authState) {
  //       getTodo()
  //       subscribe()
  //       console.log('success')
  //     } else {
  //       state.todos = []
  //       console.log('faild')
  //     }
  //   })
  //   console.log('呼び出し')
  // }

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
      clearText()
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
    try {
      const todosData: any = await API.graphql(graphqlOperation(listTodos))
      state.todos.push(...state.todos, ...todosData.data.listTodos.items)
    } catch (e) {
      console.log(e)
    }
  }

  // サブスクリプション
  // onCreate
  const subscribe = async () => {
    try {
      const user = await Auth.currentUserInfo()
      const client = await API.graphql(
        graphqlOperation(onCreateTodo, { owner: user.username })
      )

      if ('subscribe' in client) {
        client.subscribe({
          next: (eventData: any): void => {
            const todo = eventData.value.data.onCreateTodo
            state.todos = [...state.todos, todo]
          },
        })
      }
    } catch (e) {
      console.log(`${e}  faild`)
    }
  }

  // Todo編集
  // いったん普通のeditTodoしてからmountedとかcreatedで呼び出す（っぽい）
  const subscribeEdit = async () => {
    // ユーザー情報取得
    const user = await Auth.currentUserInfo()
    // graphqlOperationは内容によって戻り値が違うのでany型つけとく
    const client: any = await API.graphql(
      graphqlOperation(onUpdateTodo, { owner: user.username })
    )

    client.subscribe({
      next: (eventData: any): void => {
        const updatedEvent = eventData.value.data.onUpdateTodo
        // 配列のindexを取得
        const index = state.todos.findIndex(
          (item: any) => item.id === updatedEvent.id
        )
        state.todos.splice(index, 1, updatedEvent)
      },
    })
  }

  // todo削除（サブスクリプション）
  const subscribeDelete = async () => {
    // ユーザー情報取得
    const user = await Auth.currentUserInfo()
    const client: any = await API.graphql(
      graphqlOperation(onDeleteTodo, { owner: user.username })
    )

    client.subscribe({
      next: (eventData: any): void => {
        const delEvent = eventData.value.data.onDeleteTodo
        // 配列のindexを取得
        const index = state.todos.findIndex(
          (eventData: any) => eventData.id === delEvent.id
        )
        state.todos.splice(index, 1)
      },
    })
  }

  return {
    state,
    signIn,
    signOut,
    addTodo,
    editTodo,
    delTodo,
    editFlag,
    clearText,
    getTodo,
    subscribe,
    subscribeEdit,
    subscribeDelete,
  }
}
export type TodoStore = ReturnType<typeof useTodo>
export default useTodo
