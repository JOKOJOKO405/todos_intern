<template>
  <div class="container">
    <h1 class="todo__title">TODOリスト</h1>
    <BoardComponent>
      <FormComponent />
      <ListComponent />
      <OptionComponent />
    </BoardComponent>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from '@nuxtjs/composition-api'
import { TodoKey } from '~/composition/compositionKey'
import { TodoStore } from '~/composition/useTodo'

export default defineComponent({
  setup() {
    const { created } = inject(TodoKey) as TodoStore
    return { created }
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
}
</style>
