<!-- src/components/Top10List.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';

type LogItem = { id: string; body: string; like: number; hug: number };

const items = ref<LogItem[]>([]);

onMounted(async () => {
  const q = query(
    collection(db, 'top10_logs'),
    orderBy('date', 'desc'),
    limit(1),
  );
  const snap = await getDocs(q);
  if (!snap.empty) {
    items.value = snap.docs[0].data().items as LogItem[];
  }
});
</script>

<template>
  <ul class="space-y-2">
    <li v-for="item in items" :key="item.id" class="flex justify-between">
      <span class="font-medium">{{ item.body }}</span>
      <span class="text-sm text-gray-500">👍 {{ item.like }} • 🤗 {{ item.hug }}</span>
    </li>
  </ul>
</template>
