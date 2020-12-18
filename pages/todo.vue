<template>
  <div class="container">
    <h1 class="todo__title">TODOリスト</h1>
    <BoardComponent>
      <FormComponent />
      <ul class="todo__list">
        <li
          v-for="(todo, index) in state.todos"
          :key="index"
          class="todo__item"
        >
          <p class="todo__name" @click="editFlag(index)">{{ todo.name }}</p>
          <p class="todo__date">{{ todo.createdAt }}</p>
          <button class="todo__delBtn" @click="delTodo(index)">Del</button>
        </li>
      </ul>
      <OptionComponent />
    </BoardComponent>
    <form @submit.prevent="signOut">
      <button class="signOut">Sign Out</button>
    </form>
  </div>
</template>

<script lang="ts">
import { Auth } from 'aws-amplify'
import { defineComponent, inject, onMounted } from '@nuxtjs/composition-api'
import { TodoKey } from '~/composition/compositionKey'
import { TodoStore } from '~/composition/useTodo'

export default defineComponent({
  setup() {
    onMounted(async () => {
      const user = await Auth.currentUserInfo()
      if (user == null) {
        window.$nuxt.$router.push('/')
      } else {
        getTodo()
        subscribe()
      }
    })
    const { signOut, state, getTodo, subscribe, editFlag, delTodo } = inject(
      TodoKey
    ) as TodoStore
    return { signOut, state, getTodo, subscribe, editFlag, delTodo }
  },
})
</script>

<style lang="scss">
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
.signOut {
  background: #4d4d4d;
  color: #fff;
  padding: 16px;
  width: 160px;
  border: none;
  display: block;
  margin: 0 auto;
}
</style>
