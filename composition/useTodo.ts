import { reactive } from '@nuxtjs/composition-api'
// import { onAuthUIStateChange } from '@aws-amplify/ui-components'
import { Auth } from 'aws-amplify'
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
    console.log('消したよ')
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
  const subscribe = async () => {
    try {
      const user = await Auth.currentUserInfo()
      console.log(user)
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
  }
}
export type TodoStore = ReturnType<typeof useTodo>
export default useTodo
