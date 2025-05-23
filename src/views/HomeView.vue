<!-- src/views/HomeView.vue -->
<script setup lang="ts">
import PostForm   from '@/components/PostForm.vue';
import TimeLine   from '@/components/TimeLine.vue';
import Top10List  from '@/components/Top10List.vue';
</script>

<template>
  <main class="container mx-auto flex-1 px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
    <!-- 左カラム：昨日の TOP10 -->
    <section id="top10" class="md:col-span-1 bg-white rounded-xl shadow p-4">
      <h2 class="text-xl font-semibold mb-3">昨日の TOP10</h2>
      <!-- ここで items は Top10List 側の ref なので問題なし -->
      <Top10List />
    </section>

    <!-- 右２カラム：投稿＋掲示板 -->
    <section id="board" class="md:col-span-2 space-y-6">
      <div id="post" class="bg-white rounded-xl shadow p-4">
        <h2 class="text-xl font-semibold mb-3">投稿する</h2>
        <PostForm />
      </div>
      <div class="bg-white rounded-xl shadow p-4">
        <h2 class="text-xl font-semibold mb-3">掲示板</h2>
        <TimeLine />
      </div>
    </section>
  </main>
</template>
