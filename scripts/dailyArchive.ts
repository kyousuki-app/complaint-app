// scripts/dailyArchive.ts
import admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// 1) サービスアカウントキーを環境変数から読み込み
const key = JSON.parse(process.env.GCP_SA_KEY!);
admin.initializeApp({
  credential: admin.credential.cert(key),
});
const db = admin.firestore();

async function main() {
  const now = admin.firestore.Timestamp.now();

  // a) isPublic=true を取得
  const snap = await db.collection('posts')
    .where('isPublic', '==', true)
    .get();

  const batch = db.batch();
  // b) 非公開化
  snap.docs.forEach(d => batch.update(d.ref, { isPublic: false }));

  // c) Board ごとに Top10
  for (const board of ['guchi','kenja'] as const) {
    const arr = snap.docs
      .map(d => ({ id: d.id, ...(d.data() as any) }))
      .filter(p => p.board === board)
      .sort((a,b)=> (b.like+b.hug)-(a.like+a.hug))
      .slice(0,10)
      .map(({id,body,like,hug})=>({ id, body, like, hug }));

    const logRef = db.collection('top10_logs').doc();
    batch.set(logRef, { board, date: now, items: arr });
  }

  await batch.commit();
  console.log('✅ Daily archive done.');
}

main().catch(err=>{
  console.error(err);
  process.exit(1);
});
