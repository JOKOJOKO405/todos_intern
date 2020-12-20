<template>
  <ul class="todo__list">
    <li v-for="(todo, index) in state.todos" :key="index" class="todo__item">
      <p class="todo__name" @click="editFlag(index)">{{ todo.name }}</p>
      <p class="todo__date">{{ todo.createdAt }}</p>
      <button class="todo__delBtn" @click="delTodo(index)">Del</button>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted } from '@nuxtjs/composition-api'
import { TodoStore } from '~/composition/useTodo'
import { TodoKey } from '~/composition/compositionKey'

export default defineComponent({
  setup() {
    const {
      state,
      getTodo,
      subscribe,
      subscribeEdit,
      delTodo,
      editFlag,
      subscribeDelete,
    } = inject(TodoKey) as TodoStore
    onMounted(() => {
      getTodo()
      subscribe()
      subscribeEdit()
      subscribeDelete()
    })
    return {
      state,
      getTodo,
      subscribe,
      delTodo,
      editFlag,
      subscribeEdit,
      subscribeDelete,
    }
  },
})
</script>

<style lang="scss">
.todo {
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
