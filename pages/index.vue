<template>
  <div class="container">
    <amplify-authenticsator>
      <h1 class="todo__title">TODOリスト</h1>
      <FormComponent />
      <ListComponent />
      <OptionComponent />
      <amplify-sign-out></amplify-sign-out>
    </amplify-authenticsator>
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
}
</style>
