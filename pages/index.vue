<template>
  <div class="container">
    <form class="form" @submit.prevent="signIn">
      <label>
        <span class="label">ユーザー名</span>
        <input v-model="state.name" type="text" name="name" />
      </label>
      <label class="label">
        <span>パスワード</span>
        <input v-model="state.pass" type="password" name="pass" />
      </label>
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
.form {
  .label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
  }
  input {
    border: 1px solid #ccc;
    padding: 10px;
    width: 100%;
    border-radius: 4px;
    &:not(:nth-of-type(2)) {
      margin-bottom: 24px;
    }
  }
  button {
    outline: none;
    border: none;
    padding: 16px;
    background: #3bc37f;
    color: #fff;
    width: 320px;
    display: block;
    margin: 0 auto;
    border-radius: 4px;
  }
}
</style>
