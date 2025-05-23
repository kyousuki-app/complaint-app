<!-- src/componets/PostForm.vue -->

<script setup lang="ts">
import { ref } from 'vue'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db, auth } from '@/firebase'

const body = ref('')
const tag = ref<'work' | 'school' | 'love' | 'other'>('work')

async function submit() {
  if (!auth.currentUser || !body.value) return
  await addDoc(collection(db, 'posts'), {
    uid: auth.currentUser.uid,
    body: body.value,
    tag: tag.value,
    board: 'guchi',
    createdAt: serverTimestamp(),
    isPublic: true,
    like: 0,
    hug: 0,
    hidden: false,
  })
  body.value = ''
}
</script>

<template>
  <form @submit.prevent="submit" class="space-y-2">
    <textarea
      v-model="body"
      maxlength="120"
      placeholder="今日のグチを120文字で…"
      class="w-full p-2 border rounded"
    />
    <select v-model="tag" class="border rounded p-1">
      <option value="work">仕事</option>
      <option value="school">学校</option>
      <option value="love">恋愛</option>
      <option value="other">その他</option>
    </select>
    <button type="submit" class="bg-orange-500 text-white px-4 py-1 rounded">投稿</button>
  </form>
</template>
