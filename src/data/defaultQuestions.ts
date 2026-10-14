import { Question } from '../types/exam';

export const DEFAULT_QUESTIONS: Question[] = [
  // ==========================================
  // SECTION 1: 文字・語彙 (Script & Vocabulary)
  // ==========================================
  {
    id: 'vocab-1',
    section: 'vocabulary',
    subCategory: '漢字の読み方 (Kanji Reading)',
    title: '＿＿＿の ことばの よみかたとして いちばん いい ものを ひとつ えらんでください。',
    rubyText: 'きのう、<ruby>新しい<rt>あたら</rt></ruby> <ruby>自転車<rt>じてんしゃ</rt></ruby>を <ruby>買い<rt>か</rt></ruby>ました。',
    question: 'きのう、<u>新しい</u> じてんしゃを かいました。',
    underlinedWord: '新しい',
    options: ['あたらしい', 'ふるい', 'うつくしい', 'ただしい'],
    correctAnswer: 0,
    kanjiDetails: [
      {
        kanji: '新',
        readingHiragana: 'あたら・しい',
        onyomi: 'シン (SHIN)',
        kunyomi: 'あたら-しい、あら-た (atara-shii, ara-ta)',
        meaningBn: 'নতুন / আধুনিক',
        meaningJa: '新しい、あらたまる',
        strokeCount: 13,
        compounds: [
          { word: '新聞', reading: 'しんぶん', meaningBn: 'সংবাদপত্র / পত্রিকা' },
          { word: '新年', reading: 'しんねん', meaningBn: 'নতুন বছর' },
          { word: '新幹線', reading: 'しんかんせん', meaningBn: 'জাপানের বুলেট ট্রেন' },
        ],
        sentenceExample: {
          sentence: '新しいパソコンを買いました。',
          reading: 'あたらしい パソコンを かいました。',
          meaningBn: 'আমি একটি নতুন কম্পিউটার কিনেছি।',
        },
      },
      {
        kanji: '自',
        readingHiragana: 'じ',
        onyomi: 'ジ、シ',
        kunyomi: 'みずか-ら',
        meaningBn: 'নিজে / স্বয়ংক্রিয়',
        compounds: [
          { word: '自転車', reading: 'じてんしゃ', meaningBn: 'সাইকেল' },
          { word: '自動車', reading: 'じどうしゃ', meaningBn: 'মোটরগাড়ি / গাড়ি' },
          { word: '自分', reading: 'じぶん', meaningBn: 'নিজে' },
        ],
      },
    ],
    explanationBn: {
      meaningBn: 'গতকাল আমি একটি নতুন সাইকেল কিনেছি।',
      correctReasonBn: '「新しい」কাঞ্জিটির সঠিক উচ্চারণ হলো「あたらしい」যার অর্থ "নতুন"।',
      distractorReasonsBn: [
        'ふるい (古い) = পুরাতন বা পুরোনো। এটি বিপরীতার্থক শব্দ।',
        'うつくしい (美しい) = সুন্দর বা চমৎকার।',
        'ただしい (正しい) = সঠিক বা নির্ভুল।',
      ],
      vocabularyNotesBn: [
        '新しい (あたらしい) = নতুন',
        '自転車 (じてんしゃ) = সাইকেল',
        '買いました (かいました) = কিনেছিলাম (ক্রিয়াপদ)',
      ],
      grammarNotesBn: '「い-adjective」হিসেবে「新しい」শব্দটি পরবর্তী বিশেষ্য「自転車」-কে সরাসরি বিশেষিত করেছে।',
    },
    isCustom: false,
  },
  {
    id: 'vocab-2',
    section: 'vocabulary',
    subCategory: '漢字の読み方 (Kanji Reading)',
    title: '＿＿＿の ことばの よみかたとして いちばん いい ものを ひとつ えらんでください。',
    rubyText: '<ruby>毎週<rt>まいしゅう</rt></ruby> <ruby>日曜日<rt>にちようび</rt></ruby>に <ruby>家族<rt>かぞく</rt></ruby>に でんわを します。',
    question: 'まいしゅう にちようびに <u>家族</u>に でんわを します。',
    underlinedWord: '家族',
    options: ['ともだち', 'きょうだい', 'かぞく', 'りょうしん'],
    correctAnswer: 2,
    kanjiDetails: [
      {
        kanji: '家',
        readingHiragana: 'いえ / か',
        onyomi: 'カ、ケ',
        kunyomi: 'いえ、や',
        meaningBn: 'বাড়ি / পরিবার',
        compounds: [
          { word: '家族', reading: 'かぞく', meaningBn: 'পরিবার' },
          { word: '家', reading: 'いえ', meaningBn: 'বাড়ি / ঘর' },
          { word: '家内', reading: 'かない', meaningBn: 'স্ত্রী (নিজের)' },
        ],
      },
      {
        kanji: '族',
        readingHiragana: 'ぞく',
        onyomi: 'ゾク',
        meaningBn: 'জাতি / উপজাতি / আত্মীয় গোষ্ঠী',
        compounds: [
          { word: '家族', reading: 'かぞく', meaningBn: 'পরিবার' },
          { word: '民族', reading: 'みんぞく', meaningBn: 'জাতিগোষ্ঠী' },
        ],
      },
    ],
    explanationBn: {
      meaningBn: 'প্রতি রবিবার আমি পরিবারে ফোন করি।',
      correctReasonBn: '「家族」কাঞ্জির সঠিক উচ্চারণ「かぞく」, যার অর্থ "পরিবার"।',
      distractorReasonsBn: [
        'ともだち (友達) = বন্ধু।',
        'きょうだい (兄弟) = ভাইবোন।',
        'りょうしん (両親) = পিতা-মাতা।',
      ],
      vocabularyNotesBn: [
        '家族 (かぞく) = পরিবার',
        '毎週 (まいしゅう) = প্রতি সপ্তাহে',
        '日曜日 (にちようび) = রবিবার',
      ],
      grammarNotesBn: 'নির্দিষ্ট কোনো দিনে বা বারে কাজ করার সময়「曜日 ＋ に」পার্টিকল বসে।',
    },
    isCustom: false,
  },
  {
    id: 'vocab-3',
    section: 'vocabulary',
    subCategory: '漢字の読み方 (Kanji Reading)',
    title: '＿＿＿の ことばの よみかたとして いちばん いい ものを ひとつ えらんでください。',
    rubyText: '駅の <ruby>近く<rt>ちか</rt></ruby>に おいしい レストランが あります。',
    question: 'えきの <u>近く</u>に おいしい レストランが あります。',
    underlinedWord: '近く',
    options: ['とおく', 'ちかく', 'まえ', 'うしろ'],
    correctAnswer: 1,
    kanjiDetails: [
      {
        kanji: '近',
        readingHiragana: 'ちか・い',
        onyomi: 'キン',
        kunyomi: 'ちか-い',
        meaningBn: 'কাছে / নিকটে',
        compounds: [
          { word: '近く', reading: 'ちかく', meaningBn: 'নিকট / কাছাকাছি' },
          { word: '近所', reading: 'きんじょ', meaningBn: 'প্রতিবেশ / আশেপাশের এলাকা' },
          { word: '最近', reading: 'さいきん', meaningBn: 'সম্প্রতি' },
        ],
      },
    ],
    explanationBn: {
      meaningBn: 'স্টেশনের কাছে একটি সুস্বাদু রেস্তোরাঁ আছে।',
      correctReasonBn: '「近く」কাঞ্জিটির সঠিক রিডিং হলো「ちかく」(কাছে বা নিকটে)।',
      distractorReasonsBn: [
        'とおく (遠く) = দূর বা দূরে (বিপরীত শব্দ)।',
        'まえ (前) = সামনে।',
        'うしろ (後ろ) = পেছনে।',
      ],
      vocabularyNotesBn: [
        '近く (ちかく) = কাছে / নিকটে',
        '駅 (えき) = স্টেশন',
        'おいしい = সুস্বাদু',
      ],
    },
    isCustom: false,
  },
  {
    id: 'vocab-4',
    section: 'vocabulary',
    subCategory: '表記 (Kanji Selection)',
    title: '＿＿＿の ことばは どう かきますか。いちばん いい ものを ひとつ えらんでください。',
    rubyText: 'あしたの あさは ７じに <ruby>おきます<rt>起きる</rt></ruby>。',
    question: 'あしたの あさは ７じに <u>おきます</u>。',
    underlinedWord: 'おきます',
    options: ['行きます', '来ます', '起きます', '寝ます'],
    correctAnswer: 2,
    kanjiDetails: [
      {
        kanji: '起',
        readingHiragana: 'お・きる / お・こす',
        onyomi: 'キ',
        kunyomi: 'お-きる、お-こす',
        meaningBn: 'ঘুম থেকে ওঠা / জাগ্রত হওয়া',
        compounds: [
          { word: '起きる', reading: 'おきる', meaningBn: 'ঘুম থেকে ওঠা' },
          { word: '早起き', reading: 'はやおき', meaningBn: 'ভোরে ঘুম থেকে ওঠা' },
        ],
      },
    ],
    explanationBn: {
      meaningBn: 'আগামীকাল সকাল ৭টায় ঘুম থেকে উঠব।',
      correctReasonBn: 'ঘুম থেকে ওঠার ক্ষেত্রে「起きます」(おきます) কাঞ্জিটি সঠিক।',
      distractorReasonsBn: [
        '行きます (いきます) = যাওয়া।',
        '来ます (きます) = আসা।',
        '寝ます (ねます) = ঘুমানো (বিপরীত অর্থ)।',
      ],
      vocabularyNotesBn: [
        '起きます (おきます) = ঘুম থেকে ওঠা',
        '寝ます (ねます) = ঘুমাতে যাওয়া',
      ],
    },
    isCustom: false,
  },
  {
    id: 'vocab-5',
    section: 'vocabulary',
    subCategory: '文脈規定 (Contextual Vocabulary)',
    title: '（　）に なにを いれますか。いちばん いい ものを ひとつ えらんでください。',
    rubyText: 'あついですね。<ruby>窓<rt>まど</rt></ruby>を （　）ましょうか。',
    question: 'あついですね。まどを （　）ましょうか。',
    underlinedWord: 'まどを （　）ましょうか',
    options: ['あけ', 'しめ', 'つけ', 'けし'],
    correctAnswer: 0,
    kanjiDetails: [
      {
        kanji: '開',
        readingHiragana: 'あ・ける / ひら・く',
        onyomi: 'カイ',
        kunyomi: 'あ-ける、ひら-く',
        meaningBn: 'খোলা / উন্মুক্ত করা',
        compounds: [
          { word: '開ける', reading: 'あける', meaningBn: 'খোলা (জানালা/দরজা)' },
          { word: '開始', reading: 'かいし', meaningBn: 'শুরু করা' },
        ],
      },
      {
        kanji: '窓',
        readingHiragana: 'まど',
        onyomi: 'ソウ',
        kunyomi: 'まど',
        meaningBn: 'জানালা',
        compounds: [
          { word: '窓口', reading: 'まどぐち', meaningBn: 'কাউন্টার / সেবা উইন্ডো' },
        ],
      },
    ],
    explanationBn: {
      meaningBn: 'গরম লাগছে তাই না? জানালাটা কি খুলে দেব?',
      correctReasonBn: 'গরম লাগলে জানালা খোলা স্বাভাবিক। জানালা খোলার ক্রিয়া হলো「窓を開ける」(まどをあける)।',
      distractorReasonsBn: [
        'しめ (閉め) = বন্ধ করা (窓を閉める)। গরম লাগলে বন্ধ করা অর্থহীন।',
        'つけ (点け) = বাতি/এসি চালু করা (電気・エアコンをつける)।',
        'けし (消し) = বাতি নেভানো বা বন্ধ করা (電気を消す)।',
      ],
      vocabularyNotesBn: [
        '窓 (まど) = জানালা',
        '開けます (あけます) = খোলা',
        '閉めます (しめます) = বন্ধ করা',
      ],
      grammarNotesBn: '「～ましょうか」দ্বারা অন্য কাউকে কোনো কাজে সাহায্য করার প্রস্তাব দেওয়া বোঝায়।',
    },
    isCustom: false,
  },
  {
    id: 'vocab-6',
    section: 'vocabulary',
    subCategory: '文脈規定 (Contextual Vocabulary)',
    title: '（　）に なにを いれますか。いちばん いい ものを ひとつ えらんでください。',
    rubyText: 'ごはんを たべた あとで、（　）を のみます。',
    question: 'ごはんを たべた あとで、（　）を のみます。',
    underlinedWord: '（　）を のみます',
    options: ['くすり', 'おさら', 'スプーン', 'はし'],
    correctAnswer: 0,
    kanjiDetails: [
      {
        kanji: '薬',
        readingHiragana: 'くすり',
        onyomi: 'ヤク',
        kunyomi: 'くすり',
        meaningBn: 'ওষুধ',
        compounds: [
          { word: '薬局', reading: 'やっきょく', meaningBn: 'ফার্মেসি / ওষুধের দোকান' },
          { word: '目薬', reading: 'めぐすり', meaningBn: 'চোখের ড্রপ' },
        ],
      },
    ],
    explanationBn: {
      meaningBn: 'খাবার খাওয়ার পরে ওষুধ খাব।',
      correctReasonBn: 'জাপানি ভাষায় ওষুধ খাওয়া বোঝাতে「薬を飲む」(くすりをのむ) ব্যবহৃত হয়।',
      distractorReasonsBn: [
        'おさら (お皿) = প্লেট / থালা (যা খাওয়া যায় না)।',
        'スプーン = চামচ (Spoon)।',
        'はし (箸) = চপস্টিকস।',
      ],
      vocabularyNotesBn: [
        '薬 (くすり) = ওষুধ',
        '飲みます (のみます) = পান করা / ওষুধ সেবন করা',
        '～たあとで = ...করার পরে',
      ],
    },
    isCustom: false,
  },

  // ==========================================
  // SECTION 2: 会話・表現 (Conversation & Expression)
  // ==========================================
  {
    id: 'conv-1',
    section: 'conversation',
    subCategory: '日常会話 (Daily Conversation)',
    title: '（　）に はいる いちばん いい ものを ひとつ えらんでください。',
    passage: 'Ａ「すみません、この 近くに コンビニは ありますか。」\nＢ「ええ、（　）。あそこの 信号の 角です。」',
    rubyText: 'Ａ「すみません、この 近くに コンビニは ありますか。」\nＢ「ええ、（　）。あそこの <ruby>信号<rt>しんごう</rt></ruby>の <ruby>角<rt>かど</rt></ruby>です。」',
    question: 'Ｂ「ええ、（　）。あそこの 信号の 角です。」',
    underlinedWord: '（　）',
    options: ['ありますよ', 'ありませんよ', 'ありましたよ', 'ありませんでした'],
    correctAnswer: 0,
    kanjiDetails: [
      {
        kanji: '信',
        readingHiragana: 'しん',
        onyomi: 'シン',
        meaningBn: 'বিশ্বাস / সংকেত',
        compounds: [
          { word: '信号', reading: 'しんごう', meaningBn: 'ট্রাফিক সিগন্যাল' },
          { word: '自信', reading: 'じしん', meaningBn: 'আত্মবিশ্বাস' },
        ],
      },
      {
        kanji: '角',
        readingHiragana: 'かど / つの',
        onyomi: 'カク',
        kunyomi: 'かど、つの',
        meaningBn: 'কোণা / মোড় / শিং',
        compounds: [
          { word: '角', reading: 'かど', meaningBn: 'রাস্তার মোড় / কোণ' },
          { word: '四角', reading: 'しかく', meaningBn: 'বর্গক্ষেত্র' },
        ],
      },
    ],
    explanationBn: {
      meaningBn: 'A: "মাফ করবেন, এই কাছে কি কোনো কনভিনিয়েন্স স্টোর আছে?"\nB: "হ্যাঁ, আছে। ঐ ট্রাফিক সিগন্যালের কোণায়।"',
      correctReasonBn: 'যেহেতু B উত্তর দিয়েছে「ええ」(হ্যাঁ), তাই অস্তিত্ব বোঝাতে বর্তমান কালের ইতিবাচক রূপ「ありますよ」বসবে।',
      distractorReasonsBn: [
        'ありませんよ = "নেই" (নেতিবাচক), যা「ええ」(হ্যাঁ)-এর সাথে মেলে না।',
        'ありましたよ = অতীতকাল (ছিল), কিন্তু দোকান এখনও বর্তমান।',
        'ありませんでした = অতীত নেতিবাচক (ছিল না)।',
      ],
      vocabularyNotesBn: [
        '信号 (しんごう) = ট্রাফিক সিগন্যাল',
        '角 (かど) = মোড় / কোণা',
        'コンビニ = কনভিনিয়েন্স স্টোর',
      ],
      grammarNotesBn: 'অন্যকে নতুন তথ্য জানাতে বা নিশ্চিত করতে বাক্যের শেষে「よ」পার্টিকল বসে।',
    },
    isCustom: false,
  },
  {
    id: 'conv-2',
    section: 'conversation',
    subCategory: '職場でのやり取り (Workplace Request)',
    title: '（　）に はいる いちばん いい ものを ひとつ えらんでください。',
    passage: '会社で、先輩に 書類を 見てもらいたいとき：',
    rubyText: '<ruby>山田<rt>やまだ</rt></ruby>さん、この <ruby>書類<rt>しょるい</rt></ruby>を （　）いただけませんか。',
    question: '山田さん、この しょるいを <u>（　）いただけませんか</u>。',
    underlinedWord: '（　）いただけませんか',
    options: ['みて', 'みせて', 'みられ', 'みせられ'],
    correctAnswer: 0,
    kanjiDetails: [
      {
        kanji: '見',
        readingHiragana: 'み・る',
        onyomi: 'ケン',
        kunyomi: 'み-る、み-える、み-せる',
        meaningBn: 'দেখা / পর্যবেক্ষণ করা',
        compounds: [
          { word: '見る', reading: 'みる', meaningBn: 'দেখা' },
          { word: '見せる', reading: 'みせる', meaningBn: 'দেখানো' },
          { word: '意見', reading: 'いけん', meaningBn: 'মতামত' },
        ],
      },
    ],
    explanationBn: {
      meaningBn: 'ইয়ামাদা-সান, দয়া করে কি এই কাগজপত্রটি একটু দেখে দিতে পারেন?',
      correctReasonBn: 'কাউকে দিয়ে কোনো কাজ করিয়ে নেওয়ার জন্য মার্জিত অনুরোধ「Verbて ＋ いただけませんか」। তাই「見ていただけませんか」সঠিক।',
      distractorReasonsBn: [
        'みせて (見せて) = "আমাকে দেখান" (ভুল অর্থ দাঁড়ায়)।',
        'みられ = প্যাসিভ রূপ, যা অনুরোধের ফর্মুলার সাথে বসে না।',
        'みせられ = অপ্রাসঙ্গিক রূপ।',
      ],
      vocabularyNotesBn: [
        '書類 (しょるい) = কাগজপত্র / ডকুমেন্টস',
        '見ていただく = কাউকে দিয়ে দেখে নেওয়া',
      ],
      grammarNotesBn: '「～ていただけませんか」হলো মার্জিত বিনম্র অনুরোধ (Polite Business Japanese)।',
    },
    isCustom: false,
  },
  {
    id: 'conv-3',
    section: 'conversation',
    subCategory: '体調・健康 (Health Advice)',
    title: '（　）に はいる いちばん いい ものを ひとつ えらんでください。',
    passage: 'Ａ「顔色が わるいですね。どうしたんですか。」\nＢ「きのうから 熱が あって、のども 痛いんです。」\nＡ「それは いけませんね。きょうは 早く （　）ほうが いいですよ。」',
    rubyText: 'Ａ「それは いけませんね。きょうは <ruby>早<rt>はや</rt></ruby>く （　）ほうが いいですよ。」',
    question: 'Ａ「それは いけませんね。きょうは はやく <u>（　）ほうが いいですよ</u>。」',
    underlinedWord: '（　）ほうが いいですよ',
    options: ['帰る', '帰った', '帰らない', '帰って'],
    correctAnswer: 1,
    kanjiDetails: [
      {
        kanji: '早',
        readingHiragana: 'はや・い',
        onyomi: 'ソウ',
        kunyomi: 'はや-い',
        meaningBn: 'তাড়াতাড়ি / আগেভাগে / দ্রুত',
        compounds: [
          { word: '早く', reading: 'はやく', meaningBn: 'তাড়াতাড়ি' },
          { word: '早朝', reading: 'そうちょう', meaningBn: 'ভোরবেলা' },
        ],
      },
      {
        kanji: '帰',
        readingHiragana: 'かえ・る',
        onyomi: 'キ',
        kunyomi: 'かえ-る',
        meaningBn: 'ফিরে যাওয়া / প্রত্যাবর্তন',
        compounds: [
          { word: '帰る', reading: 'かえる', meaningBn: 'বাড়ি ফেরা' },
          { word: '帰国', reading: 'きこく', meaningBn: 'স্বদেশে ফেরা' },
        ],
      },
    ],
    explanationBn: {
      meaningBn: 'A: "সে তো খারাপ কথা। আজ তাড়াতাড়ি বাড়ি ফিরে যাওয়াই ভালো হবে।"',
      correctReasonBn: 'কাউকে কোনো ইতিবাচক পরামর্শ দেওয়ার ব্যাকরণ হলো「Verb (た-form) ＋ ほうがいいです」। তাই「帰った」(かえった) সঠিক।',
      distractorReasonsBn: [
        '帰る = ডিকশনারি রূপ, পরামর্শের জন্য「た-form」প্রয়োজন।',
        '帰らない = নেতিবাচক রূপ (না ফেরা ভালো), যা অসুস্থ ব্যক্তির জন্য অযৌক্তিক।',
        '帰って = তে-ফর্ম, যা এই ব্যাকরণের সাথে বসে না।',
      ],
      vocabularyNotesBn: [
        '熱 (ねつ) = জ্বর',
        '顔色 (かおいろ) = মুখের চেহারা/ভাব',
      ],
      grammarNotesBn: '「Verbた ＋ ほうがいい」= ...করা উচিত বা ভালো (Advice giving)।',
    },
    isCustom: false,
  },

  // ==========================================
  // SECTION 3: 聴解 (Listening Comprehension)
  // ==========================================
  {
    id: 'listen-1',
    section: 'listening',
    subCategory: '指示・行動の聞き取り (Listening for Instructions)',
    title: '音声を聞いて、質問に答えてください。質問の答えとして最もよいものを一つ選んでください。',
    audioText: '男の人と女の人が話しています。女の人は、このあとまず何をしますか。\n\n男：田中さん、午後の会議の準備を手伝ってくれませんか。\n女：はい、何をすればいいですか。\n男：まず、この資料を２０部コピーしてください。そのあとで、会議室にパソコンをセットしてください。\n女：わかりました。すぐやります。\n\n質問：女の人は、このあとまず何をしますか。',
    audioTranscriptJa: '男：田中さん、午後の会議の準備を手伝ってくれませんか。\n女：はい、何をすればいいですか。\n男：まず、この資料を２０部コピーしてください。そのあとで、会議室にパソコンをセットしてください。\n女：わかりました。すぐやります。',
    question: '女の人は、このあと <u>まず 何を しますか</u>。',
    underlinedWord: 'まず 何を しますか',
    options: [
      '会議室に パソコンを セットする',
      '資料を コピーする',
      '田中さんに 電話を かける',
      'お昼ごはんを 食べる',
    ],
    correctAnswer: 1,
    kanjiDetails: [
      {
        kanji: '会',
        readingHiragana: 'あ・う / かい',
        onyomi: 'カイ',
        kunyomi: 'あ-う',
        meaningBn: 'মিট করা / সভা / মিলন',
        compounds: [
          { word: '会議', reading: 'かいぎ', meaningBn: 'মিটিং / সভা' },
          { word: '会社', reading: 'かいしゃ', meaningBn: 'কোম্পানি' },
          { word: '会話', reading: 'かいわ', meaningBn: 'কথোপকথন' },
        ],
      },
      {
        kanji: '料',
        readingHiragana: 'りょう',
        onyomi: 'リョウ',
        meaningBn: 'উপকরণ / ফি / তথ্য',
        compounds: [
          { word: '資料', reading: 'しりょう', meaningBn: 'নথিপত্র / ডকুমেন্টস' },
          { word: '料理', reading: 'りょうり', meaningBn: 'রান্না' },
        ],
      },
    ],
    explanationBn: {
      meaningBn: 'পুরুষ ও মহিলা কথা বলছেন। মহিলাটি এর পরে সর্বপ্রথম কী করবেন?\nপুরুষ: "তানাকা-সান, দুপুরের মিটিংয়ের প্রস্তুতিতে সাহায্য করবেন?"\nমহিলা: "হ্যাঁ, কী করতে হবে?"\nপুরুষ: "প্রথমে এই ডকুমেন্টের ২০ কপি ফটোকপি করুন। তার পরে মিটিং রুমে কম্পিউটার সেট করবেন।"\nপ্রশ্ন: মহিলাটি এর পরে সবার আগে কী করবেন?',
      correctReasonBn: 'পুরুষটি সরাসরি বলেছেন:「まず、この資料を２０部コピーしてください」(প্রথমে এই ডকুমেন্টের ২০ সেট ফটোকপি করুন)। তাই প্রথম কাজ ফটোকপি করা।',
      distractorReasonsBn: [
        'パソコンをセットする = এটি ফটোকপির পরের কাজ (そのあとで)।',
        '電話をかける = সংলাপে ফোন করার কোনো উল্লেখ নেই।',
        'お昼ごはんを食べる = দুপুরের খাবারের কোনো প্রসঙ্গ নেই।',
      ],
      vocabularyNotesBn: [
        'まず = সর্বপ্রথম / প্রথমে',
        '資料 (しりょう) = ডকুমেন্টস / তথ্যপত্র',
        '会議室 (かいぎしつ) = মিটিং রুম',
      ],
      grammarNotesBn: '「まず～、そのあとで…」দ্বারা ধারাবাহিক কাজের অগ্রাধিকার বোঝানো হয়।',
    },
    isCustom: false,
  },
  {
    id: 'listen-2',
    section: 'listening',
    subCategory: '予定・時間の聞き取り (Schedule & Platform)',
    title: '音声を聞いて、質問に答えてください。質問の答えとして最もよいものを一つ選んでください。',
    audioText: '駅でアナウンスを聞いています。東京行きの電車は何番線から出ますか。\n\nアナウンス：まもなく、３番線に東京行きの上り電車がまいります。危険ですから、黄色い線の内側までお下がりください。なお、４番線の電車は回送電車です。ご乗車になれません。\n\n質問：東京行きの電車は何番線から出ますか。',
    audioTranscriptJa: 'アナウンス：まもなく、３番線に東京行きの上り電車がまいります。危険ですから、黄色い線の内側までお下がりください。なお、４番線の電車は回送電車です。ご乗車になれません。',
    question: '東京行きの 電車は <u>何番線から</u> 出ますか。',
    underlinedWord: '何番線から',
    options: ['１番線', '２番線', '３番線', '４番線'],
    correctAnswer: 2,
    kanjiDetails: [
      {
        kanji: '番',
        readingHiragana: 'ばん',
        onyomi: 'バン',
        meaningBn: 'নম্বর / পালা',
        compounds: [
          { word: '何番線', reading: 'なんばんせん', meaningBn: 'কত নম্বর প্ল্যাটফর্ম' },
          { word: '一番', reading: 'いちばん', meaningBn: 'এক নম্বর / সবচেয়ে বেশি' },
          { word: '電話番号', reading: 'でんわばんごう', meaningBn: 'ফোন নম্বর' },
        ],
      },
      {
        kanji: '線',
        readingHiragana: 'せん',
        onyomi: 'セン',
        meaningBn: 'রেখা / লাইন / রেললাইন',
        compounds: [
          { word: '３番線', reading: 'さんばんせん', meaningBn: '৩ নম্বর লাইন' },
          { word: '新幹線', reading: 'しんかんせん', meaningBn: 'বুলেট ট্রেন' },
        ],
      },
    ],
    explanationBn: {
      meaningBn: 'স্টেশনে ঘোষণা শোনা যাচ্ছে। টোকিওগামী ট্রেনটি কত নম্বর প্ল্যাটফর্ম থেকে ছাড়বে?\nঘোষণা: "কিছুক্ষণের মধ্যে ৩ নম্বর লাইনে টোকিওগামী ট্রেন প্রবেশ করবে। ৪ নম্বর লাইনের ট্রেনটি খালি ট্রেন, এতে ওঠা যাবে না।"',
      correctReasonBn: 'ঘোষণায় স্পষ্ট বলা হয়েছে:「まもなく、３番線に東京行きの上り電車がまいります」(৩ নম্বর লাইনে টোকিওগামী ট্রেন আসবে)।',
      distractorReasonsBn: [
        '４番線 = ৪ নম্বর লাইনের ট্রেনটি 回送 (খালি ট্রেন / নট ইন সার্ভিস)।',
        '１番線, ２番線 = এই প্ল্যাটফর্মগুলোর কোনো ঘোষণা ছিল না।',
      ],
      vocabularyNotesBn: [
        '何番線 (なんばんせん) = কত নম্বর লাইন/প্ল্যাটফর্ম',
        'まもなく = অতি শীঘ্রই',
        '回送 (かいそう) = আউট অব সার্ভিস',
      ],
    },
    isCustom: false,
  },

  // ==========================================
  // SECTION 4: 読解 (Reading Comprehension)
  // ==========================================
  {
    id: 'read-1',
    section: 'reading',
    subCategory: '案内・お知らせ (Information Notice)',
    title: 'つぎの ごみの すてかたの お知らせを よんで、しつもんに こたえてください。',
    passage: '【マンションの ごみの 日】\n・もえる ごみ：火曜日・金曜日の あさ ８時まで\n・もえない ごみ：第２・第４ 水曜日の あさ ８時まで\n・ペットボトル・びん・かん：木曜日の あさ ８時まで\n※ 前の日の 夜には 出さないでください。',
    rubyText: '【マンションの ごみの <ruby>日<rt>ひ</rt></ruby>】\n・<ruby>燃<rt>も</rt></ruby>える ごみ：<ruby>火曜日<rt>かようび</rt></ruby>・<ruby>金曜日<rt>きんようび</rt></ruby>の あさ ８<ruby>時<rt>じ</rt></ruby>まで\n・<ruby>燃<rt>も</rt></ruby>えない ごみ：<ruby>第２<rt>だい に</rt></ruby>・<ruby>第４<rt>だい よん</rt></ruby> <ruby>水曜日<rt>すいようび</rt></ruby>の あさ ８<ruby>時<rt>じ</rt></ruby>まで\n・ペットボトル・びん・かん：<ruby>木曜日<rt>もくようび</rt></ruby>の あさ ８<ruby>時<rt>じ</rt></ruby>まで\n※ <ruby>前<rt>まえ</rt></ruby>の<ruby>日<rt>ひ</rt></ruby>の <ruby>夜<rt>よる</rt></ruby>には <ruby>出<rt>だ</rt></ruby>さないでください。',
    question: 'ペットボトルや かんを すてたいです。<u>いつ だしますか</u>。',
    underlinedWord: 'いつ だしますか',
    options: [
      '火曜日の あさ ８時まで',
      '水曜日の あさ ８時まで',
      '木曜日の あさ ８時まで',
      '金曜日の よる',
    ],
    correctAnswer: 2,
    kanjiDetails: [
      {
        kanji: '木',
        readingHiragana: 'き / もく',
        onyomi: 'モク、ボク',
        kunyomi: 'き、こ',
        meaningBn: 'গাছ / কাঠ / বৃহস্পতিবার',
        compounds: [
          { word: '木曜日', reading: 'もくようび', meaningBn: 'বৃহস্পতিবার' },
          { word: '木', reading: 'き', meaningBn: 'গাছ' },
        ],
      },
      {
        kanji: '燃',
        readingHiragana: 'も・える',
        onyomi: 'ネン',
        kunyomi: 'も-える、も-やす',
        meaningBn: 'জ্বলা / দাহ্য',
        compounds: [
          { word: '燃えるゴミ', reading: 'もえるごみ', meaningBn: 'দাহ্য ময়লা' },
          { word: '燃料', reading: 'ねんりょう', meaningBn: 'জ্বালানি' },
        ],
      },
    ],
    explanationBn: {
      meaningBn: '【অ্যাপার্টমেন্টের ময়লা ফেলার দিন】\n・দাহ্য বর্জ্য: মঙ্গলবার ও শুক্রবার সকাল ৮টার মধ্যে\n・অদাহ্য বর্জ্য: ২য় ও ৪র্থ বুধবার সকাল ৮টার মধ্যে\n・প্লাস্টিকের বোতল, কাঁচ ও ক্যান: বৃহস্পতিবার সকাল ৮টার মধ্যে\n※ পূর্বের দিন রাতে ময়লা ফেলবেন না।\nপ্রশ্ন: প্লাস্টিকের বোতল বা ক্যান ফেলতে চাই। কখন বাইরে দেব?',
      correctReasonBn: 'নোটিশে পরিষ্কার লেখা আছে:「ペットボトル・びん・かん：木曜日の あさ ８時まで」(প্লাস্টিক বোতল ও ক্যান: বৃহস্পতিবার সকাল ৮টার মধ্যে)।',
      distractorReasonsBn: [
        '火曜日の あさ ８時まで = এটি দাহ্য বর্জ্য (燃えるごみ) ফেলার দিন।',
        '水曜日の あさ ８時まで = এটি অদাহ্য বর্জ্য (燃えないごみ) ফেলার দিন।',
        '金曜日の よる = নোটিশে আগের রাতে ময়লা ফেলতে নিষেধ করা হয়েছে।',
      ],
      vocabularyNotesBn: [
        '燃えるごみ (もえるごみ) = দাহ্য ময়লা',
        '燃えないごみ (もえないごみ) = অদাহ্য ময়লা',
        '出します (だします) = বাইরে ফেলা / জমা দেওয়া',
      ],
    },
    isCustom: false,
  },
  {
    id: 'read-2',
    section: 'reading',
    subCategory: 'メール・メッセージ (Email / Message)',
    title: 'つぎの メールを よんで、しつもんに こたえてください。',
    passage: '件名：あしたの バーベキューについて\n田中さん、おつかれさまです。スミスです。\nあしたの バーベキューですが、午後から 雨が ふるそうです。\nですから、バーベキューは 中止にして、駅前の カラオケに 行きませんか。\n時間は 予定どおり １２時に 駅の 改札口に 集まりましょう。\n返事を ください。よろしく お願いします。',
    rubyText: '<ruby>件名<rt>けんめい</rt></ruby>：あしたの バーベキューについて\n<ruby>田中<rt>たなか</rt></ruby>さん、おつかれさまです。スミスです。\nあしたの バーベキューですが、<ruby>午後<rt>ごご</rt></ruby>から <ruby>雨<rt>あめ</rt></ruby>が ふるそうです。\nですから、バーベキューは <ruby>中止<rt>ちゅうし</rt></ruby>にして、<ruby>駅前<rt>えきまえ</rt></ruby>の カラオケに <ruby>行<rt>い</rt></ruby>きませんか。\n<ruby>時間<rt>じかん</rt></ruby>は <ruby>予定<rt>よてい</rt></ruby>どおり １２<ruby>時<rt>じ</rt></ruby>に <ruby>駅<rt>えき</rt></ruby>の <ruby>改札口<rt>かいさつぐち</rt></ruby>に <ruby>集<rt>あつ</rt></ruby>まりましょう。\n<ruby>返事<rt>へんじ</rt></ruby>を ください。よろしく お<ruby>願<rt>ねが</rt></ruby>いします。',
    question: 'あした <u>どこで、何時に</u> あつまりますか。',
    underlinedWord: 'どこで、何時に',
    options: [
      '公園で １２時',
      '駅の 改札口で １２時',
      'カラオケで １時',
      '駅前の レストランで １２時',
    ],
    correctAnswer: 1,
    kanjiDetails: [
      {
        kanji: '集',
        readingHiragana: 'あつ・まる',
        onyomi: 'シュウ',
        kunyomi: 'あつ-まる、あつ-める',
        meaningBn: 'জড়ো হওয়া / একত্র হওয়া',
        compounds: [
          { word: '集まる', reading: 'あつまる', meaningBn: 'জড়ো হওয়া' },
          { word: '集合', reading: 'しゅうごう', meaningBn: 'জমায়েত / মিটিং পয়েন্ট' },
        ],
      },
      {
        kanji: '札',
        readingHiragana: 'さつ / ふだ',
        onyomi: 'サツ',
        meaningBn: 'টিকিট / নোট / কার্ড',
        compounds: [
          { word: '改札口', reading: 'かいさつぐち', meaningBn: 'স্টেশনের টিকিট গেট' },
          { word: 'お札', reading: 'おさつ', meaningBn: 'কাগজের টাকা' },
        ],
      },
    ],
    explanationBn: {
      meaningBn: 'বিষয়: আগামীকালের বারবিকিউ প্রসঙ্গে\nতানাকা-সান, কেমন আছেন? আমি স্মিথ বলছি।\nআগামীকালের বারবিকিউ প্রসঙ্গে, বিকেলে বৃষ্টি হতে পারে বলে শোনা যাচ্ছে।\nতাই বারবিকিউ বাতিল করে স্টেশনের সামনের কারাওকে-তে গেলে কেমন হয়?\nসময় আগের নির্ধারিত অনুযায়ী দুপুর ১২টায় স্টেশনের টিকিট কাউন্টারের সামনে জড়ো হব।\nউত্তর জানাবেন। ধন্যবাদ।',
      correctReasonBn: 'ইমেইলের ৪র্থ লাইনে স্পষ্ট বলা হয়েছে:「時間は 予定どおり １２時に 駅の 改札口に 集まりましょう」(সময় নির্ধারিত অনুযায়ী ১২টায় স্টেশনের টিকিট গেটের সামনে মিলিত হব)।',
      distractorReasonsBn: [
        '公園で １２時 = পার্কের বারবিকিউ বাতিল করা হয়েছে।',
        'カラオケで １時 = সাক্ষাতের সময় ১টা নয়, ১২টা।',
        '駅前の レストランで = রেস্তোরাঁয় মিলিত হওয়ার কথা বলা হয়নি।',
      ],
      vocabularyNotesBn: [
        '改札口 (かいさつぐち) = স্টেশনের টিকিট গেট',
        '集まります (あつまります) = জড়ো হওয়া / মিলিত হওয়া',
        '中止 (ちゅうし) = বাতিল / স্থগিত',
      ],
    },
    isCustom: false,
  },
];
