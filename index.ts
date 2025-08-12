import type { ScheduledEvent, Context, ScheduledHandler } from 'aws-lambda';
import { createClient } from '@supabase/supabase-js';
import { getRandomMessage } from './constants.js';
import dotenv from 'dotenv';

// 環境変数を読み込み
dotenv.config();

// Supabaseクライアントの初期化
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be provided');
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 定期実行されるLambda関数のハンドラー
 */
export const handler: ScheduledHandler = async (
  event: ScheduledEvent,
  context: Context
): Promise<void> => {
  console.log('定期実行Lambda開始');
  console.log('Event:', JSON.stringify(event, null, 2));
  console.log('Context:', JSON.stringify(context, null, 2));

  try {
    // ランダムなメッセージを取得
    const message = getRandomMessage();
    console.log('Selected message:', message);

    const timestamp = new Date().toISOString();
    console.log(`処理実行時刻: ${timestamp}`);

    // 実際の処理をここに実装
    await performScheduledTask(message);

    console.log('定期実行Lambda正常終了');
  } catch (error) {
    console.error('エラーが発生しました:', error);
    throw error; // CloudWatchにエラーを記録
  }
};

/**
 * 定期実行する実際のタスク
 */
async function performScheduledTask(message: string): Promise<void> {
  console.log('定期タスクを実行中...');

  // Supabaseのlogテーブルにメッセージをinsert
  const { data, error } = await supabase
    .from('log')
    .insert([
      {
        message: message
      }
    ]);

  if (error) {
    console.error('Supabaseへのinsertでエラーが発生:', error);
    throw error;
  }

  console.log('Supabaseにログを挿入しました:', data);

  // 例: 外部APIを呼び出す
  // const response = await fetch('https://api.example.com/data');
  // const data = await response.json();
  // console.log('API Response:', data);

  // 例: 環境変数を使用
  const environment = process.env.NODE_ENV || 'development';
  console.log(`環境: ${environment}`);

  // 処理の完了をシミュレート
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('定期タスク完了');
}
