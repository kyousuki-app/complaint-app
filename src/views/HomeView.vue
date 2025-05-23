<!-- src/views/HomeView.vue -->

<script setup lang="ts">
import PostForm from '@/components/PostForm.vue'
import TimeLine from '@/components/TimeLine.vue'
</script>

<template>
  <main class="max-w-lg mx-auto p-4">
    <PostForm />
    <TimeLine />
  </main>
</template>
