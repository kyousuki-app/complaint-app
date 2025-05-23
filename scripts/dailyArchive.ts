// scripts/dailyArchive.ts

import * as admin from 'firebase-admin';

// 1) サービスアカウントキーを環境変数から読み込み
const key = JSON.parse(process.env.GCP_SA_KEY!);
admin.initializeApp({
  credential: admin.credential.cert(key),
});
const db = admin.firestore();

// Firestore のドキュメント型を定義
interface PostData {
  board: 'guchi' | 'kenja';
  like:  number;
  hug:   number;
  body:  string;
  isPublic: boolean;
}

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
    // データを PostData 型として取得
    const posts = snap.docs
      .map(d => {
        const data = d.data() as PostData;
        return { id: d.id, ...data };
      })
      .filter(p => p.board === board)
      .sort((a, b) => (b.like + b.hug) - (a.like + a.hug))
      .slice(0, 10)
      .map(p => ({
        id:   p.id,
        body: p.body,
        like: p.like,
        hug:  p.hug,
      }));

    // ログ用コレクションにセット
    const logRef = db.collection('top10_logs').doc();
    batch.set(logRef, { board, date: now, items: posts });
  }

  await batch.commit();
  console.log('✅ Daily archive done.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
