<template>
  <div class="container">
    <h1 class="todo__title">TODOリスト</h1>
    <form class="todo__form" @submit.prevent="addTodo">
      <input v-model="text" type="text" class="todo__input" />
      <button v-if="!isEdit" class="todo__btn">Add todo</button>
      <button v-else class="todo__btn">OverWrite</button>
    </form>
    <ul class="todo__list">
      <li v-for="(todo, index) in todos" :key="todo.id" class="todo__item">
        <p class="todo__name" @click="editFlag(index)">{{ todo.todo }}</p>
        <p class="todo__date">{{ todo.createdAt }}</p>
        <button class="todo__delBtn" @click="deleteTodo(index)">Del</button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      todos: [],
      text: '',
      isEdit: false,
      todoIndex: '',
      newTodo: '',
    }
  },
  methods: {
    addTodo(): void {
      if (this.text !== '') {
        if (!this.isEdit) {
          this.todos.push({
            todo: this.text,
            createdAt: new Date(),
          })
          this.text = ''
        } else {
          this.todos[this.todoIndex].todo = this.text
        }
        this.isEdit = false
      }
    },
    deleteTodo(index: number): void {
      this.todos.splice(index, 1)
    },
    editFlag(index) {
      this.isEdit = true
      this.text = this.todos[index].todo
      this.todoIndex = index
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
  }
  &__input {
    padding: 10px;
    border-radius: 4px;
    border: none;
    width: 80%;
  }
  &__list {
    list-style: none;
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
