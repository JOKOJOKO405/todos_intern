<template>
  <div>
    <select v-model.number="sort">
      <option selected>ソート</option>
      <option value="1">作成日↑↑↑</option>
      <option value="2">作成日↓↓↓</option>
    </select>
    <input v-model="searchText" type="text" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({})
</script>
