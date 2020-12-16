<template>
  <div class="container">
    <amplify-authenticator>
      <h1 class="todo__title">TODOリスト</h1>
      <form class="todo__form">
        <input v-model="text" type="text" class="todo__input" />
        <button v-if="!isEdit" class="todo__btn" @click.prevent="addTodo">
          Add todo
        </button>
        <button
          v-else
          class="todo__btn todo__btn-notice"
          @click.prevent="editTodo"
        >
          OverWrite
        </button>
        <button class="todo__btn todo__btn-clear" @click.prevent="clearText">
          Clear
        </button>
      </form>
      <div>
        <select id="" name="">
          <option selected>ソート</option>
          <option value="1">作成日↑↑↑</option>
          <option value="2">作成日↓↓↓</option>
        </select>
      </div>
      <ul class="todo__list">
        <li v-for="(todo, index) in todos" :key="todo.id" class="todo__item">
          <p class="todo__name" @click="editFlag(index)">{{ todo.name }}</p>
          <p class="todo__date">{{ todo.createdAt }}</p>
          <button class="todo__delBtn" @click="deleteTodo(index)">Del</button>
        </li>
      </ul>
      <amplify-sign-out></amplify-sign-out>
    </amplify-authenticator>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import API, { graphqlOperation } from '@aws-amplify/api'
import { createTodo, updateTodo, deleteTodo } from '~/src/graphql/mutations'
import { listTodos } from '~/src/graphql/queries'
// import { onCreateTodo } from '~/src/graphql/subscriptions'

export type DataType = {
  todos: any[]
  text: String
  isEdit: boolean
  todoIndex: any
  newTodo: String
}

export default Vue.extend({
  data(): DataType {
    return {
      todos: [],
      text: '',
      isEdit: false,
      todoIndex: '',
      newTodo: '',
    }
  },
  created() {
    this.getTodo()
    // this.subscribe()
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
    // addTodo(): void {
    //   if (this.text !== '') {
    //     if (!this.isEdit) {
    //       this.todos.push({
    //         todo: this.text,
    //         createdAt: new Date(),
    //       })
    //       this.text = ''
    //     } else {
    //       this.todos[this.todoIndex].todo = this.text
    //     }
    //     this.isEdit = false
    //   }
    // },
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
    // async subscribe() {
    //   const client = await API.graphql({ query: onCreateTodo })
    //   if ('subscribe' in client) {
    //     client.subscribe({
    //       next: (eventData: any): void => {
    //         const todo = eventData.value.data.onCreateTodo
    //         if (this.todos.some((item) => item.name === todo.name)) return
    //         this.todos = [...this.todos, todo]
    //       },
    //     })
    //   }
    // },
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
.button {
  border-radius: 8px;
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
  &__form {
    background: #e1eedc;
    padding: 32px;
    margin-bottom: 32px;
  }
  &__btn {
    outline: none;
    background: #3bc37f;
    color: #fff;
    border: none;
    padding: 10px;
    border-radius: 4px;
    font-weight: bold;
    &-notice {
      background: #e5994c;
    }
    &-clear {
      background: #34caca;
    }
  }
  &__input {
    padding: 10px;
    border-radius: 4px;
    border: none;
    width: 73%;
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
