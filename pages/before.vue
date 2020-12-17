<template>
  <div class="container">
    <amplify-authenticator>
      <h1 class="todo__title">TODOリスト</h1>
      <!-- <FormComponent /> -->
      <OptionComponent />
      <!-- <ListComponent /> -->
      <amplify-sign-out></amplify-sign-out>
    </amplify-authenticator>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import API, { graphqlOperation } from '@aws-amplify/api'
// 認証系
import { onAuthUIStateChange } from '@aws-amplify/ui-components'
import { createTodo, deleteTodo, updateTodo } from '~/src/graphql/mutations'
import { listTodos } from '~/src/graphql/queries'
import { onCreateTodo } from '~/src/graphql/subscriptions'
// import FormComponent from '~/components/FormComponent.vue'
import OptionComponent from '~/components/OptionComponent.vue'
// import ListComponent from '~/components/ListComponent.vue'

export type DataType = {
  todos: any[]
  text: string
  isEdit: boolean
  todoIndex: any
  newTodo: string
  sort: number
  searchText: string
}

export default Vue.extend({
  components: {
    // FormComponent,
    OptionComponent,
    // ListComponent,
  },
  data(): DataType {
    return {
      todos: [],
      text: '',
      isEdit: false,
      todoIndex: '',
      newTodo: '',
      sort: 1,
      searchText: '',
    }
  },
  created() {
    onAuthUIStateChange((authData, authState) => {
      if (authData && authState) {
        this.getTodo()
        this.subscribe()
      } else {
        this.todos = []
      }
    })
  },
  methods: {
    async addTodo() {
      const todo = {
        name: this.text,
      }
      if (this.text !== '') {
        if (!this.isEdit) {
          await API.graphql(graphqlOperation(createTodo, { input: todo }))
          this.text = ''
        }
      }
    },
    async editTodo() {
      const todo = {
        name: this.text,
      }
      const todoId: string = this.todos[this.todoIndex].id

      if (this.text !== '') {
        await API.graphql(
          graphqlOperation(updateTodo, {
            input: {
              id: todoId,
              ...todo,
            },
          })
        )
        this.isEdit = false
      }
    },
    async deleteTodo(index: any) {
      const todoId: string = this.todos[index].id
      await API.graphql(graphqlOperation(deleteTodo, { input: { id: todoId } }))
    },
    editFlag(index: any) {
      this.isEdit = true
      this.text = this.todos[index].name
      this.todoIndex = index
    },
    clearText(): void {
      this.text = ''
      this.isEdit = false
    },
    async getTodo() {
      const todosData: any = await API.graphql(graphqlOperation(listTodos))
      this.todos.push(...this.todos, ...todosData.data.listTodos.items)
    },
    async subscribe() {
      const client = await API.graphql(graphqlOperation(onCreateTodo))
      if ('subscribe' in client) {
        client.subscribe({
          next: (eventData: any): void => {
            const todo = eventData.value.data.onCreateTodo
            this.todos = [...this.todos, todo]
          },
        })
      }
    },
  },
})
</script>

<style lang="scss">
* {
  &,
  &::before,
  &::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
}
.container {
  padding: 50px;
  max-width: 840px;
  margin: 0 auto;
}
.todo {
  &__title {
    font: {
      size: 40px;
    }
    color: #4d4d4d;
    margin: 0 auto 40px;
    text-align: center;
  }
  &__list {
    list-style: none;
    margin-bottom: 40px;
  }
  &__item {
    border-bottom: 1px solid #eee;
    padding: 16px 0;
    display: flex;
    align-items: center;
  }
  &__name {
    margin-right: 16px;
  }
  &__date {
    font-size: 12px;
    color: #ccc;
    margin-right: 16px;
  }
  &__delBtn {
    padding: 4px 16px;
    color: #fff;
    border-radius: 4px;
    border: none;
    background: #f19273;
  }
}
</style>
