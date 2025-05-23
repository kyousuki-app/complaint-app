<!-- src/App.vue -->
<script setup lang="ts">
// もう何も定義しない！
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <header class="bg-white shadow">
      <div class="container mx-auto px-4 py-3 flex items-center justify-between">
        <h1 class="text-2xl font-bold">今日をスッキリ!!</h1>
        <nav class="hidden md:flex space-x-4 text-gray-600">
          <a href="#top10" class="hover:text-gray-900">昨日のTOP10</a>
          <a href="#post"  class="hover:text-gray-900">投稿</a>
          <a href="#board" class="hover:text-gray-900">掲示板</a>
        </nav>
      </div>
    </header>

    <!-- ここでは何も渡さず、ルートコンポーネントだけ切り替える -->
    <RouterView />

    <footer class="bg-white text-center py-4 text-gray-500 text-sm">
      © 2025 今日をスッキリ!! All rights reserved.
    </footer>
  </div>
</template>
