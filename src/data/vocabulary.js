// Key vocabulary extracted from the 102 phrases
// Each word can be flipped J->H or H->J in flashcard mode

export const vocabulary = [
  // 代名詞 (pronouns)
  { id: 'v1', romanized: 'main', devanagari: 'मैं', japanese: '私', notes: '一人称単数', category: 'Pronouns' },
  { id: 'v2', romanized: 'āp', devanagari: 'आप', japanese: 'あなた（敬称）', notes: 'ビジネスで標準', category: 'Pronouns' },
  { id: 'v3', romanized: 'ham', devanagari: 'हम', japanese: '私たち', notes: '一人称複数', category: 'Pronouns' },
  { id: 'v4', romanized: 'yah / ye', devanagari: 'यह', japanese: 'これ', notes: '会話では ye と発音', category: 'Pronouns' },
  { id: 'v5', romanized: 'kyā', devanagari: 'क्या', japanese: '何／〜ですか', notes: '疑問詞・Yes/No 文頭', category: 'Pronouns' },

  // 挨拶・決まり文句
  { id: 'v6', romanized: 'namaste', devanagari: 'नमस्ते', japanese: 'こんにちは／さようなら', notes: '万能挨拶', category: 'Greetings' },
  { id: 'v7', romanized: 'dhanyavād', devanagari: 'धन्यवाद', japanese: 'ありがとう（フォーマル）', notes: 'サンスクリット系', category: 'Greetings' },
  { id: 'v8', romanized: 'shukriyā', devanagari: 'शुक्रिया', japanese: 'ありがとう（カジュアル）', notes: 'ウルドゥー系', category: 'Greetings' },
  { id: 'v9', romanized: 'māf kījie', devanagari: 'माफ़ कीजिए', japanese: 'すみません', notes: 'お詫び', category: 'Greetings' },
  { id: 'v10', romanized: 'kṛpayā', devanagari: 'कृपया', japanese: 'お願いします／どうか', notes: '依頼を丁寧に', category: 'Greetings' },

  // よく使う形容詞・状態
  { id: 'v11', romanized: 'ṭhīk', devanagari: 'ठीक', japanese: '大丈夫／OK', notes: '会話頻出', category: 'Adjectives' },
  { id: 'v12', romanized: 'achchhā', devanagari: 'अच्छा', japanese: '良い', notes: '男性形。女性形は achchhī', category: 'Adjectives' },
  { id: 'v13', romanized: 'bahut', devanagari: 'बहुत', japanese: 'とても／たくさん', notes: '強調', category: 'Adverbs' },
  { id: 'v14', romanized: 'thoṛā / thoṛī', devanagari: 'थोड़ा', japanese: '少し', notes: '男性 thoṛā / 女性 thoṛī', category: 'Adjectives' },
  { id: 'v15', romanized: 'zarūrī', devanagari: 'ज़रूरी', japanese: '重要な／必要な', notes: '', category: 'Adjectives' },
  { id: 'v16', romanized: 'taiyār', devanagari: 'तैयार', japanese: '準備できた', notes: '性数不変', category: 'Adjectives' },
  { id: 'v17', romanized: 'kharāb', devanagari: 'ख़राब', japanese: '悪い／壊れた', notes: '', category: 'Adjectives' },
  { id: 'v18', romanized: 'pūrā', devanagari: 'पूरा', japanese: '完全な／全部の', notes: '男性形', category: 'Adjectives' },

  // 名詞
  { id: 'v19', romanized: 'nām', devanagari: 'नाम', japanese: '名前', notes: '男性名詞', category: 'Nouns' },
  { id: 'v20', romanized: 'kām', devanagari: 'काम', japanese: '仕事', notes: '男性名詞', category: 'Nouns' },
  { id: 'v21', romanized: 'samay', devanagari: 'समय', japanese: '時間', notes: '男性名詞', category: 'Nouns' },
  { id: 'v22', romanized: 'din', devanagari: 'दिन', japanese: '日', notes: '男性名詞', category: 'Nouns' },
  { id: 'v23', romanized: 'bāt', devanagari: 'बात', japanese: '話／こと', notes: '女性名詞', category: 'Nouns' },
  { id: 'v24', romanized: 'sawāl', devanagari: 'सवाल', japanese: '質問', notes: '男性名詞', category: 'Nouns' },
  { id: 'v25', romanized: 'jawāb', devanagari: 'जवाब', japanese: '答え／返事', notes: '男性名詞', category: 'Nouns' },
  { id: 'v26', romanized: 'rāy', devanagari: 'राय', japanese: '意見', notes: '女性名詞', category: 'Nouns' },
  { id: 'v27', romanized: 'madad', devanagari: 'मदद', japanese: '助け', notes: '女性名詞', category: 'Nouns' },
  { id: 'v28', romanized: 'patā', devanagari: 'पता', japanese: '知識／情報', notes: 'mujhe patā hai = 知っている', category: 'Nouns' },
  { id: 'v29', romanized: 'samajh', devanagari: 'समझ', japanese: '理解', notes: '女性名詞', category: 'Nouns' },
  { id: 'v30', romanized: 'sujhāv', devanagari: 'सुझाव', japanese: '提案', notes: '男性名詞', category: 'Nouns' },
  { id: 'v31', romanized: 'charchā', devanagari: 'चर्चा', japanese: '議論', notes: '女性名詞', category: 'Nouns' },
  { id: 'v32', romanized: 'yātrā', devanagari: 'यात्रा', japanese: '訪問／旅', notes: '女性名詞', category: 'Nouns' },
  { id: 'v33', romanized: 'āwāz', devanagari: 'आवाज़', japanese: '声／音', notes: '女性名詞', category: 'Nouns' },

  // 動詞（不定形）
  { id: 'v34', romanized: 'honā', devanagari: 'होना', japanese: '〜である／なる', notes: '最重要動詞', category: 'Verbs' },
  { id: 'v35', romanized: 'karnā', devanagari: 'करना', japanese: '〜する', notes: '複合動詞でも頻用', category: 'Verbs' },
  { id: 'v36', romanized: 'jānā', devanagari: 'जाना', japanese: '行く', notes: '完了形に使われやすい', category: 'Verbs' },
  { id: 'v37', romanized: 'ānā', devanagari: 'आना', japanese: '来る／（言語が）できる', notes: '能力構文も', category: 'Verbs' },
  { id: 'v38', romanized: 'denā', devanagari: 'देना', japanese: '与える／〜してあげる', notes: '補助動詞でも頻用', category: 'Verbs' },
  { id: 'v39', romanized: 'lenā', devanagari: 'लेना', japanese: '取る／〜してしまう', notes: '補助動詞でも頻用', category: 'Verbs' },
  { id: 'v40', romanized: 'kahnā', devanagari: 'कहना', japanese: '言う', notes: '', category: 'Verbs' },
  { id: 'v41', romanized: 'bolnā', devanagari: 'बोलना', japanese: '話す', notes: '', category: 'Verbs' },
  { id: 'v42', romanized: 'sunnā', devanagari: 'सुनना', japanese: '聞く', notes: '', category: 'Verbs' },
  { id: 'v43', romanized: 'dekhnā', devanagari: 'देखना', japanese: '見る／確認する', notes: '', category: 'Verbs' },
  { id: 'v44', romanized: 'samajhnā', devanagari: 'समझना', japanese: '理解する', notes: '', category: 'Verbs' },
  { id: 'v45', romanized: 'milnā', devanagari: 'मिलना', japanese: '会う／得る', notes: '', category: 'Verbs' },
  { id: 'v46', romanized: 'sochnā', devanagari: 'सोचना', japanese: '考える', notes: '', category: 'Verbs' },
  { id: 'v47', romanized: 'bhejnā', devanagari: 'भेजना', japanese: '送る', notes: '', category: 'Verbs' },
  { id: 'v48', romanized: 'baiṭhnā', devanagari: 'बैठना', japanese: '座る', notes: '', category: 'Verbs' },
  { id: 'v49', romanized: 'pūchhnā', devanagari: 'पूछना', japanese: '聞く（質問する）', notes: '', category: 'Verbs' },
  { id: 'v50', romanized: 'likhnā', devanagari: 'लिखना', japanese: '書く', notes: '', category: 'Verbs' },
  { id: 'v51', romanized: 'saknā', devanagari: 'सकना', japanese: '〜できる', notes: '助動詞', category: 'Verbs' },
  { id: 'v52', romanized: 'chāhnā', devanagari: 'चाहना', japanese: '〜したい／欲しい', notes: '', category: 'Verbs' },
  { id: 'v53', romanized: 'sīkhnā', devanagari: 'सीखना', japanese: '学ぶ', notes: '', category: 'Verbs' },
  { id: 'v54', romanized: 'bhūlnā', devanagari: 'भूलना', japanese: '忘れる', notes: '', category: 'Verbs' },

  // 数・時間
  { id: 'v55', romanized: 'ek', devanagari: 'एक', japanese: '1', notes: '', category: 'Numbers' },
  { id: 'v56', romanized: 'das', devanagari: 'दस', japanese: '10', notes: '', category: 'Numbers' },
  { id: 'v57', romanized: 'bīs', devanagari: 'बीस', japanese: '20', notes: '', category: 'Numbers' },
  { id: 'v58', romanized: 'āj', devanagari: 'आज', japanese: '今日', notes: '', category: 'Time' },
  { id: 'v59', romanized: 'kal', devanagari: 'कल', japanese: '昨日／明日', notes: '文脈で判断', category: 'Time' },
  { id: 'v60', romanized: 'aglā / aglī', devanagari: 'अगला', japanese: '次の', notes: '男性 aglā / 女性 aglī', category: 'Adjectives' },
  { id: 'v61', romanized: 'bād mein', devanagari: 'बाद में', japanese: '後で', notes: '', category: 'Time' },
  { id: 'v62', romanized: 'phir', devanagari: 'फिर', japanese: '再び／また', notes: '', category: 'Adverbs' },
  { id: 'v63', romanized: 'jaldī', devanagari: 'जल्दी', japanese: '早く／急いで', notes: '', category: 'Adverbs' },
  { id: 'v64', romanized: 'dhīre', devanagari: 'धीरे', japanese: 'ゆっくり', notes: '', category: 'Adverbs' },

  // 後置詞・接続詞
  { id: 'v65', romanized: 'se', devanagari: 'से', japanese: '〜から／〜で', notes: '後置詞', category: 'Postpositions' },
  { id: 'v66', romanized: 'mein', devanagari: 'में', japanese: '〜の中で／〜で', notes: '後置詞', category: 'Postpositions' },
  { id: 'v67', romanized: 'par', devanagari: 'पर', japanese: '〜の上で／〜について', notes: '後置詞', category: 'Postpositions' },
  { id: 'v68', romanized: 'tak', devanagari: 'तक', japanese: '〜まで', notes: '後置詞', category: 'Postpositions' },
  { id: 'v69', romanized: 'ke lie', devanagari: 'के लिए', japanese: '〜のために', notes: '後置詞', category: 'Postpositions' },
  { id: 'v70', romanized: 'aur', devanagari: 'और', japanese: 'そして／もっと', notes: '接続詞・副詞', category: 'Conjunctions' },
  { id: 'v71', romanized: 'agar', devanagari: 'अगर', japanese: 'もし', notes: 'agar...to... で条件文', category: 'Conjunctions' },
  { id: 'v72', romanized: 'to', devanagari: 'तो', japanese: 'なら／は', notes: '', category: 'Conjunctions' },
  { id: 'v73', romanized: 'ki', devanagari: 'कि', japanese: '〜ということ', notes: '名詞節導入', category: 'Conjunctions' },

  // よく使う表現フラグメント
  { id: 'v74', romanized: 'hān', devanagari: 'हाँ', japanese: 'はい', notes: '', category: 'Responses' },
  { id: 'v75', romanized: 'nahīn', devanagari: 'नहीं', japanese: 'いいえ／〜ない', notes: '否定にも', category: 'Responses' },
  { id: 'v76', romanized: 'koī', devanagari: 'कोई', japanese: '何か／誰か', notes: '', category: 'Pronouns' },
  { id: 'v77', romanized: 'kuchh', devanagari: 'कुछ', japanese: '何か／少し', notes: '', category: 'Pronouns' },
  { id: 'v78', romanized: 'sab', devanagari: 'सब', japanese: '全部／みんな', notes: '', category: 'Pronouns' },
  { id: 'v79', romanized: 'kabhī', devanagari: 'कभी', japanese: 'いつか／ever', notes: '', category: 'Adverbs' },
  { id: 'v80', romanized: 'kahān', devanagari: 'कहाँ', japanese: 'どこ', notes: '疑問詞', category: 'Question Words' },
  { id: 'v81', romanized: 'kab', devanagari: 'कब', japanese: 'いつ', notes: '疑問詞', category: 'Question Words' },
  { id: 'v82', romanized: 'kaise / kaisī', devanagari: 'कैसे', japanese: 'どんな／どうやって', notes: '相手の性別で変化', category: 'Question Words' },
  { id: 'v83', romanized: 'kitne', devanagari: 'कितने', japanese: 'いくつ', notes: '疑問詞', category: 'Question Words' },

  // 場所・関係
  { id: 'v84', romanized: 'jāpān', devanagari: 'जापान', japanese: '日本', notes: '', category: 'Proper Nouns' },
  { id: 'v85', romanized: 'jāpānī', devanagari: 'जापानी', japanese: '日本人／日本語', notes: '', category: 'Adjectives' },
  { id: 'v86', romanized: 'bhārat', devanagari: 'भारत', japanese: 'インド', notes: '', category: 'Proper Nouns' },
  { id: 'v87', romanized: 'andar', devanagari: 'अंदर', japanese: '中', notes: '', category: 'Adverbs' },

  // ビジネス・IT
  { id: 'v88', romanized: 'khushī', devanagari: 'ख़ुशी', japanese: '嬉しさ／喜び', notes: '女性名詞', category: 'Nouns' },
  { id: 'v89', romanized: 'der', devanagari: 'देर', japanese: '遅れ', notes: '女性名詞', category: 'Nouns' },
  { id: 'v90', romanized: 'sambhav', devanagari: 'संभव', japanese: '可能な', notes: '', category: 'Adjectives' },
  { id: 'v91', romanized: 'sahmat', devanagari: 'सहमत', japanese: '同意した', notes: '', category: 'Adjectives' },
  { id: 'v92', romanized: 'tarīqā', devanagari: 'तरीक़ा', japanese: '方法', notes: '男性名詞', category: 'Nouns' },
  { id: 'v93', romanized: 'intazār', devanagari: 'इंतज़ार', japanese: '待つこと', notes: '男性名詞', category: 'Nouns' },
  { id: 'v94', romanized: 'kshamā', devanagari: 'क्षमा', japanese: '許し', notes: 'māf より硬い表現', category: 'Nouns' },
  { id: 'v95', romanized: 'sankshep', devanagari: 'संक्षेप', japanese: '要約', notes: '男性名詞', category: 'Nouns' },
  { id: 'v96', romanized: 'rukāwaṭ', devanagari: 'रुकावट', japanese: '中断／障害', notes: '女性名詞', category: 'Nouns' },
  { id: 'v97', romanized: 'māfī', devanagari: 'माफ़ी', japanese: 'お詫び', notes: '女性名詞', category: 'Nouns' },
  { id: 'v98', romanized: 'pasand', devanagari: 'पसंद', japanese: '好き', notes: '〜को 〜 पसंद है', category: 'Nouns' },
  { id: 'v99', romanized: 'pahlā / pahlī', devanagari: 'पहला', japanese: '初めの／第一の', notes: '序数詞', category: 'Adjectives' },
  { id: 'v100', romanized: 'dosrā', devanagari: 'दूसरा', japanese: '二番目の／別の', notes: '', category: 'Adjectives' },
];

export const vocabularyCategories = Array.from(
  new Set(vocabulary.map((v) => v.category))
);
