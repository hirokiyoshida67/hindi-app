# ヒンディー語学習アプリ - PERSONAL use

> 100 文以上のフレーズと 100 単語を、Flashcard / クイズ / Gemini を使った編集機能で学習するパーソナルアプリ

## 機能

| 機能 | 説明 |
|---|---|
| **フラッシュカード (J→H)** | 日本語を見てローマ字ヒンディー語を答える |
| **フラッシュカード (H→J)** | ローマ字ヒンディー語を見て日本語を答える |
| **3 択クイズ** | Gemini が動的に紛らわしい誤答を生成 |
| **単語フラッシュカード** | 100 単語の重要語彙のみで練習 |
| **フレーズ編集** | Gemini に提案を聞きながら内容を編集 |
| **履歴・統計** | 累計取り組み、正答率、日別グラフ、苦手問題 |
| **出題モード** | 1から順番／昨日やった分／正答率低い順／間違えた問題のみ／ランダム |
| **発音音声** | Web Speech API でヒンディー語を発音（無料・ブラウザ標準） |

## セットアップ

### 1. 必要なもの

- **Node.js** (v18 以上)
- **npm** (Node.js に同梱)
- **Gemini API キー** ([Google AI Studio](https://aistudio.google.com/app/apikey) で無料取得可)
- モダンブラウザ（Chrome / Edge / Safari 推奨。ヒンディー音声合成が利用可能）

### 2. プロジェクト展開と依存関係インストール

```bash
# ZIP を展開後、フォルダに移動
cd hindi-app

# 依存関係をインストール
npm install
```

### 3. Gemini API キーを設定

```bash
# .env.example を .env にコピー
cp .env.example .env

# .env を編集して API キーを記入
# VITE_GEMINI_API_KEY=ここに実際のキーを貼り付け
```

VS Code で `.env` を開き、`your_gemini_api_key_here` の部分を実際のキーに置き換えてください。

### 4. 開発サーバー起動

```bash
npm run dev
```

ブラウザが自動で `http://localhost:5173` を開きます。

### 5. 本番ビルド（オプション）

```bash
npm run build      # dist/ 以下に静的ファイルが生成される
npm run preview    # 生成物をローカルで確認
```

## データの保管

すべての記録（取り組み履歴、編集内容）は **ブラウザの localStorage に保存** されます：

- `hindi-app:attempts` — 取り組み履歴
- `hindi-app:overrides` — フレーズの編集差分
- `hindi-app:vocab-overrides` — 単語の編集差分

**注意**: localStorage はブラウザごとに別データです。Chrome で学習した記録は Safari からは見えません。

### 別端末で使うには

履歴画面の「データをエクスポート」で JSON をダウンロードし、別端末で「データをインポート」してください。

## ファイル構成

```
hindi-app/
├── .env.example              # API キーのテンプレート
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── src/
│   ├── main.jsx              # React エントリ
│   ├── App.jsx               # メイン (画面ルーティング)
│   ├── index.css             # Tailwind + グローバルスタイル
│   ├── data/
│   │   ├── phrases.js        # 102 フレーズ (v3 由来)
│   │   └── vocabulary.js     # 100 単語
│   ├── lib/
│   │   ├── storage.js        # localStorage ラッパー
│   │   ├── gemini.js         # Gemini API クライアント
│   │   ├── tts.js            # Web Speech API
│   │   └── studyEngine.js    # 問題選択ロジック
│   ├── screens/
│   │   ├── HomeScreen.jsx
│   │   ├── FlashcardScreen.jsx
│   │   ├── QuizScreen.jsx
│   │   ├── VocabScreen.jsx
│   │   ├── EditorScreen.jsx
│   │   └── HistoryScreen.jsx
│   └── components/
│       └── ExplanationPanel.jsx
└── README.md
```

## カスタマイズ・拡張のヒント

### フレーズを編集したい

- **App 内で編集**: 「フレーズ編集」画面で内容を直接編集できます（保存先は localStorage）。Gemini に提案も聞けます
- **永続的に編集（コードレベル）**: `src/data/phrases.js` を直接編集してください

### 新しい単語を追加したい

`src/data/vocabulary.js` の配列に項目を追加してください：

```js
{
  id: 'v101',
  romanized: 'naya_word',
  devanagari: 'नया शब्द',
  japanese: '新しい単語',
  notes: '補足',
  category: 'カテゴリ名'
}
```

### 発音音声を改善したい

現在は Web Speech API（ブラウザ標準）を使用。より高品質な音声が欲しい場合：

1. **Google Cloud TTS** — `src/lib/tts.js` を Cloud TTS API 呼び出しに置き換え
2. **ElevenLabs** — 同様に置き換え、声を選択可能
3. **事前録音** — `public/audio/{id}.mp3` を配置し、`<audio>` で再生

## トラブルシューティング

### ヒンディー語音声が再生されない

- お使いのブラウザに hi-IN 音声がインストールされていない可能性があります
- **Windows**: 設定 → 時刻と言語 → 言語と地域 → ヒンディー語の音声をダウンロード
- **macOS**: システム環境設定 → アクセシビリティ → 読み上げコンテンツ → システムボイス → カスタマイズ → ヒンディー語をダウンロード
- Chrome 系ブラウザは Google のクラウド音声を使うため、ほぼ確実に再生できます

### Gemini API がエラーになる

- `.env` の `VITE_GEMINI_API_KEY` が正しいか確認
- 開発サーバーを `Ctrl+C` で停止 → `npm run dev` で再起動（.env の変更は再起動が必要）
- API キーが [aistudio.google.com](https://aistudio.google.com/app/apikey) で有効か確認

### 「該当する問題がありません」と出る

「昨日やった問題のみ」や「間違えた問題のみ」を選んだ際、該当データがない場合に表示されます。出題モードを「1 から順番に」に変えてください。

## バージョン

- v0.1 — 初期プロトタイプ。102 フレーズ + 100 単語
- データ元: `hindi_phrases_v3.md`

## 今後の拡張アイデア

- [ ] 復習スケジューラ（Spaced Repetition / Anki 風）
- [ ] 録音モード（自分の発音を録音して比較）
- [ ] テキスト→画像（フレーズに合った場面のイメージ生成）
- [ ] グループ学習機能（チームでスコア共有）
- [ ] モバイル PWA 対応
