<!-- src/componets/TimeLine.vue -->

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  doc,
  runTransaction,
  serverTimestamp,
  increment,
  Timestamp,
  getDocs,
  addDoc,
} from 'firebase/firestore'
import type { DocumentData } from 'firebase/firestore'
import { auth, db } from '@/firebase'

type Post = {
  id: string
  body: string
  like: number
  hug: number
  createdAt: Timestamp
}

const posts = ref<Post[]>([])

onMounted(() => {
  const q = query(
    collection(db, 'posts'),
    where('board', '==', 'guchi'),
    where('isPublic', '==', true),
    orderBy('createdAt', 'desc'),
    limit(50)
  )

  onSnapshot(q, (snap) => {
    posts.value = snap.docs.map((d) => {
      const data = d.data() as DocumentData
      const ts = (data.createdAt as Timestamp) ?? Timestamp.now()
      return {
        id: d.id,
        body: data.body,
        like: data.like ?? 0,
        hug: data.hug ?? 0,
        createdAt: ts,
      }
    })
  })
})

async function react(postId: string, type: 'like' | 'hug') {
  if (!auth.currentUser) return
  const uid = auth.currentUser.uid
  const reactionCol = collection(db, 'reactions')

  // 重複チェック
  const dupQ = query(
    reactionCol,
    where('postId', '==', postId),
    where('uid', '==', uid),
    where('type', '==', type)
  )
  const dupSnap = await getDocs(dupQ)
  if (!dupSnap.empty) return

  // カウント更新
  const postRef = doc(db, 'posts', postId)
  await runTransaction(db, async (tx) => {
    tx.update(postRef, { [type]: increment(1) })
  })

  // リアクション追加
  await addDoc(reactionCol, {
    postId,
    uid,
    type,
    createdAt: serverTimestamp(),
  })
}
</script>

<template>
  <ul class="space-y-4 mt-4">
    <li v-for="p in posts" :key="p.id" class="border p-3 rounded">
      <p class="whitespace-pre-line">{{ p.body }}</p>
      <div class="text-xs text-gray-500 flex items-center gap-3 mt-2">
        <button @click="react(p.id, 'like')" class="flex items-center gap-1">
          👍 <span>{{ p.like }}</span>
        </button>
        <button @click="react(p.id, 'hug')" class="flex items-center gap-1">
          🤗 <span>{{ p.hug }}</span>
        </button>
        <span>{{ p.createdAt.toDate().toLocaleString() }}</span>
      </div>
    </li>
  </ul>
</template>
