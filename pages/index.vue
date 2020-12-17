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
import { defineComponent } from '@nuxtjs/composition-api'
import FormComponent from '~/components/FormComponent.vue'
import ListComponent from '~/components/ListComponent.vue'
import OptionComponent from '~/components/OptionComponent.vue'

export default defineComponent({
  components: {
    FormComponent,
    ListComponent,
    OptionComponent,
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
