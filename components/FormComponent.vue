<template>
  <form class="todo__form">
    <input v-model="state.text" type="text" class="todo__input" />
    <button v-if="!isEdit" class="todo__btn" @click.prevent="addTodo">
      Add todo
    </button>
    <button v-else class="todo__btn todo__btn-notice" @click.prevent="editTodo">
      OverWrite
    </button>
    <button class="todo__btn todo__btn-clear" @click.prevent="clearText">
      Clear
    </button>
  </form>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import useTodo from '~/composition/useTodo'

export default defineComponent({
  setup() {
    const { state, addTodo, editTodo, clearText } = useTodo()

    return {
      state,
      addTodo,
      editTodo,
      clearText,
    }
  },
})
</script>

<style lang="scss">
.todo {
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
  &__delBtn {
    padding: 4px 16px;
    color: #fff;
    border-radius: 4px;
    border: none;
    background: #f19273;
  }
}
</style>
