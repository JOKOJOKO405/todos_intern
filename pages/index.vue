<template>
  <div class="container">
    <form @submit.prevent="signIn">
      <input v-model="state.name" type="text" name="name" />
      <input v-model="state.pass" type="password" name="pass" />
      <button>Sign In</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from '@nuxtjs/composition-api'
import { TodoKey } from '~/composition/compositionKey'
import { TodoStore } from '~/composition/useTodo'

export default defineComponent({
  setup() {
    const { signIn, state } = inject(TodoKey) as TodoStore
    return { signIn, state }
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
