// scripts/dailyArchive.ts

// 1) firebase-admin v11+ の ESM モジュール形式でインポート
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

// 2) サービスアカウントキーを環境変数から読み込み
const key = JSON.parse(process.env.GCP_SA_KEY!);

// 3) Admin SDK 初期化
initializeApp({
  credential: cert(key),
});

// 4) Firestore インスタンス取得
const db = getFirestore();

// Firestore のドキュメント型を定義
interface PostData {
  board:    'guchi' | 'kenja';
  like:     number;
  hug:      number;
  body:     string;
  isPublic: boolean;
}

async function main() {
  // 現在時刻
  const now = Timestamp.now();

  // a) isPublic=true を取得
  const snap = await db.collection('posts')
    .where('isPublic', '==', true)
    .get();

  const batch = db.batch();

  // b) 非公開化
  snap.docs.forEach(d => batch.update(d.ref, { isPublic: false }));

  // c) Board ごとに Top10 を計算して logs に書き出し
  for (const board of ['guchi','kenja'] as const) {
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

    const logRef = db.collection('top10_logs').doc();
    batch.set(logRef, { board, date: now, items: posts });
  }

  // b) バッチコミット
  await batch.commit();
  console.log('✅ Daily archive done.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
