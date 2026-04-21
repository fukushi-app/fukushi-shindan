/* =============================================
   Deep Forest — script.js
   福祉職向け診断アプリ
   ============================================= */

// ===== 質問データ =====
const QUESTIONS = [
  // Q1-3: 共感/分析
  { q:'利用者への関わり方を選ぶとしたら？',       a:'気持ちに寄り添いたい',       b:'問題を整理したい',       axis:'empathy' },
  { q:'支援の場面で自然にしてしまうことは？',     a:'話をじっくり聞きたい',       b:'要点を整理したい',       axis:'empathy' },
  { q:'利用者との関係でいちばん大切にしたいのは？',a:'安心できる関係をつくりたい', b:'状況を改善したい',       axis:'empathy' },
  // Q4-6: 現場/管理
  { q:'職場での自分の役割について、どちらが近い？',a:'利用者と直接関わりたい',     b:'全体を整えたい',         axis:'field'   },
  { q:'仕事での充実感を感じるのはどんなとき？',   a:'現場で動いているとき',       b:'全体を考えているとき',   axis:'field'   },
  { q:'日々の支援で意識していることは？',         a:'目の前の支援を大切にしたい', b:'仕組みを整えたい',       axis:'field'   },
  // Q7-8: 安定/変化
  { q:'職場環境の変化についてどう感じる？',       a:'今のやり方を大切にしたい',   b:'より良く変えたい',       axis:'stable'  },
  { q:'働く環境として心地いいのはどちら？',       a:'安定した環境で働きたい',     b:'変化のある環境で働きたい',axis:'stable'  },
  // Q9-10: 個人/チーム
  { q:'仕事の進め方として自然なのはどちら？',     a:'自分のペースで進めたい',     b:'相談しながら進めたい',   axis:'solo'    },
  { q:'仕事のやり方について大切にしていることは？',a:'自分のやり方を大切にしたい', b:'チームのやり方を大切にしたい',axis:'solo'  },
  // Q11-13: リスク補助
  { q:'仕事のつらさについてどう考えることが多い？',a:'自分の関わり方を振り返りたい',b:'環境も含めて考えたい',  axis:'risk'    },
  { q:'職場のルールについて感じることは？',       a:'共有されたやり方を大切にしたい',b:'柔軟に対応したい',     axis:'risk'    },
  { q:'利用者から強く求められたとき、どう感じる？',a:'無理しすぎない関わりをしたい',b:'頑張って応えたい',      axis:'risk'    },
  // Q14: 共感/分析
  { q:'支援をふり返るとき、いちばん気になることは？',a:'気持ちを大切にしたい',    b:'改善を大切にしたい',     axis:'empathy' },
];

// ===== 16タイプデータ =====
const TYPES = {
  AAAA:{
    name:'癒しケア型', archetype:'ケアラー',
    sub:'共感・現場・安定・個を大切にする、揺るぎない支援者',
    reason:'人の痛みを自分のこととして受け取りすぎてしまう。気づかないうちに感情的な重荷を抱え込んでいる。',
    risks:['感情疲弊（バーンアウト）','「私が辞めたら」という罪悪感','一人で抱えすぎる自滅パターン'],
    tips:['「共感」と「巻き込まれ」は別物と意識する','チームで感情を共有するルーティンをつくる','定期的に「自分の気持ち」を書き出す習慣を'],
  },
  AAAB:{
    name:'お母さん型', archetype:'ケアラー',
    sub:'共感・現場・安定・チームで動く、みんなの拠り所になる存在',
    reason:'チームや利用者の感情を一手に引き受けてしまい、誰にも頼れない状況が続く。',
    risks:['過剰適応による消耗','チーム全員の相談役になりすぎる','「私がいなければ」依存の罠'],
    tips:['「聞く」と「解決する」を切り離す','「ノー」と言える場面を意識的に設ける','役割分担を明文化するよう職場に働きかける'],
  },
  AABA:{
    name:'伴走型', archetype:'ケアラー',
    sub:'共感・現場・変化・個で寄り添う、変化の中でも動じない支援者',
    reason:'変化への対応力はあるが、一人でそれを担いすぎて疲れる。周囲がついてこないと孤立感が生まれる。',
    risks:['孤軍奮闘からのガス欠','変化を求めても組織が動かないストレス','「なぜわかってもらえない」感の蓄積'],
    tips:['変化の意図をチームに言語化して共有する','一人で先走らず、仲間を引き込む','自分のペースと職場のペースのギャップを許容する'],
  },
  AABB:{
    name:'調整ファシリ型', archetype:'ケアラー',
    sub:'共感・現場・変化・チームを動かしながら関係を整える調整役',
    reason:'人の感情と組織の論理の板挟みになりやすい。「間に入りすぎる」ことで自分が削れていく。',
    risks:['板挟みからの疲弊','誰の味方かわからなくなる混乱','「また私が…」という不満の蓄積'],
    tips:['自分の立場を明確にする勇気を持つ','「調整」は支援であり、巻き込まれとは違うと知る','ファシリテーションのスキルを体系的に学ぶ'],
  },
  BAAA:{
    name:'分析ケア型', archetype:'アナリスト',
    sub:'論理で支援を整理しながら、現場と安定を重視する知的実践者',
    reason:'感情より論理で動きたいのに、現場は感情中心。「なぜここまで非合理なのか」というストレスが溜まる。',
    risks:['職場の感情的空気に馴染めない疎外感','論理が通らない場面での消耗','「冷たい人」と誤解されるリスク'],
    tips:['感情的文脈を理解する努力も評価される、と知る','分析力を「提案」に変換する習慣を持つ','信頼できる感情的サポート役を見つける'],
  },
  BAAB:{
    name:'制度理解型', archetype:'アナリスト',
    sub:'制度・ルールを熟知し、チームとともに安定運営を支える知的支援者',
    reason:'制度の抜け穴や運営の非効率さが気になりすぎる。改善提案が通らない無力感が累積する。',
    risks:['「どうせ変わらない」という虚無感','自分だけが正しいという孤立','知識を活かせない職場への不満'],
    tips:['制度の知識を「提案書」として見える化する','小さな変化を積み上げることに喜びを見出す','上の立場の人に影響を与えるコミュニケーションを磨く'],
  },
  BABA:{
    name:'改善設計型', archetype:'アナリスト',
    sub:'課題を見抜き、仕組みごと変えていく改革志向の現場改善者',
    reason:'問題点は明確に見えるのに、職場が変わらない。改善提案が「面倒くさい人」扱いされることも。',
    risks:['変化しない環境への怒りと失望','「改善」が「批判」に見られる誤解','理想と現実のギャップによる燃え尽き'],
    tips:['「改善」より「巻き込み」を先にする','小さく試して成功体験を積み重ねる','自分の提案を組織の言語に翻訳する'],
  },
  BABB:{
    name:'参謀型', archetype:'アナリスト',
    sub:'チームの戦略を裏で支える、分析×変化×チームの知的参謀',
    reason:'優れた分析力を活かせる場がない。自分が設計した仕組みを「他の人のもの」として扱われる。',
    risks:['縁の下の力持ち疲れ','貢献が見えにくい不満','「なぜ自分が評価されないのか」という焦り'],
    tips:['アウトプットに自分の名前を付ける習慣を','影響力ある人に「橋渡し」を頼む','ストーリーで成果を伝えるスキルを磨く'],
  },
  ABAA:{
    name:'職人ケア型', archetype:'クラフター',
    sub:'感情で寄り添いつつ、現場の仕事を丁寧に積み上げる職人気質',
    reason:'自分のこだわりやペースを乱されることへの抵抗感。チームの雑さが気になって仕方ない。',
    risks:['「あの人は気難しい」という誤解','自分のやり方を守れない環境への消耗','こだわりが孤立を生むジレンマ'],
    tips:['こだわりを「方針として共有する」形にする','他の人の「雑さ」にも合理性があると認める','職場内でロールモデルとして認められる機会を作る'],
  },
  ABAB:{
    name:'現場支援型', archetype:'クラフター',
    sub:'感情で寄り添いながら、チームで安定した現場を守る実直な支援者',
    reason:'地道に積み上げてきたのに評価されない。チームに依存しながらも、誰も助けてくれない孤独感。',
    risks:['頑張りが空回りする徒労感','「縁の下の力持ち」に甘んじすぎる','感謝されない環境での意欲低下'],
    tips:['自分の貢献を言語化して伝える習慣を','「チームに頼る」ことも支援者の力だと知る','セルフコンパッションの習慣を'],
  },
  ABBA:{
    name:'教育型', archetype:'クラフター',
    sub:'感情的サポートと変化への柔軟性で、後輩や利用者を育てる',
    reason:'育てようとする相手が「育たない」「変わらない」ときのフラストレーションが大きい。',
    risks:['「なぜわかってくれない」という消耗','教えることへの期待が重荷になる','職場に「教育文化」がないことへの失望'],
    tips:['成長は非線形だと受け入れる','教えることと、相手の主体性を尊重することを両立する','自分自身の学びにも投資する'],
  },
  ABBB:{
    name:'現場リーダー型', archetype:'クラフター',
    sub:'感情×現場×変化×チームを動かす、頼れる現場のリーダー候補',
    reason:'現場はうまく動かせるのに、上からの無理解や非合理な指示に阻まれる。',
    risks:['上からの圧力と現場の板挟み消耗','「もっとできるのに」という抑圧感','昇格・評価が遅い職場への不満'],
    tips:['上位層への働きかけを戦略的に行う','「現場力」を数字や言葉で上に見せる','リーダーシップを発揮できる別の舞台も探す'],
  },
  BBAA:{
    name:'改革ケア型', archetype:'プロデューサー',
    sub:'分析力で課題を捉え、現場を安定させながら変革を目指す',
    reason:'変えたいものが明確なのに、個人の力だけでは動かせない組織のもどかしさ。',
    risks:['「変えたいのに変えられない」ストレスの慢性化','周囲との温度差による孤立','理想を追いすぎて現実を見失う'],
    tips:['変革には「仲間づくり」が先決と知る','小さな変化を拾い上げてチームに見せる','自分の影響範囲から着実に始める'],
  },
  BBAB:{
    name:'アイデア型', archetype:'プロデューサー',
    sub:'分析×管理×変化×チームで新しい福祉のかたちを生み出す革新者',
    reason:'アイデアは豊富なのに、組織の慣性に阻まれる。「また無駄になった」という落胆が続く。',
    risks:['アイデア貧乏（実行されないことの疲れ）','チームからの「また言ってる」という目線','先見性が活かされないフラストレーション'],
    tips:['アイデアを「提案書1枚」に落とす習慣を','実行してくれる人を見つける','試行錯誤を楽しむ文化がある職場を選ぶ'],
  },
  BBBA:{
    name:'プロデューサー型', archetype:'プロデューサー',
    sub:'分析・変化・管理・個の力で福祉サービスをつくり変える設計者',
    reason:'「こうすれば絶対よくなる」という確信があるのに、周囲の合意形成に時間がかかりすぎる。',
    risks:['「孤高の改革者」になってしまうリスク','組織の遅さへの苛立ちの蓄積','ビジョンが独走して孤立'],
    tips:['ビジョンを「みんなのもの」にするプロセスを大切に','フォロワーシップを育てるリーダーシップを学ぶ','独立・起業という選択肢も視野に'],
  },
  BBBB:{
    name:'カリスマ型', archetype:'プロデューサー',
    sub:'すべての軸で変革を志向する、福祉界のゲームチェンジャー候補',
    reason:'組織の限界が自分の限界になっている。「もっとできる」のに、器が小さすぎる職場環境。',
    risks:['優秀すぎる人の逃げ場のなさ','部下・後輩からの嫉妬や排除','「この職場じゃ無理だ」燃え尽き'],
    tips:['自分に合ったスケールの職場・役割を選ぶ','外部ネットワークで刺激を得る','管理職・専門職・起業など複数の出口を検討する'],
  },
};

const ARCHETYPES = {
  'ケアラー':     '共感と現場を軸に、利用者との直接的な関わりを大切にするタイプ',
  'アナリスト':   '分析と管理を軸に、制度・仕組みから支援を設計するタイプ',
  'クラフター':   '現場の実践を丁寧に積み上げ、技術と感情を両立するタイプ',
  'プロデューサー':'変化と管理を軸に、組織や支援のかたちそのものを動かすタイプ',
};

const RISK_LEVELS = {
  high:{ text:'🔴 高め',    cls:'risk-high', note:'職場・自分両面の見直しが急務です' },
  mid: { text:'🟡 やや注意', cls:'risk-mid',  note:'いくつかのサインに気をつけましょう' },
  low: { text:'🟢 低め',    cls:'risk-low',  note:'今のところ安定していそうです' },
};

// ===== STATE =====
let currentQ = 0;
let answers  = [];

// ===== PAGE NAV =====
function showPage(id){
  document.querySelectorAll('.page').forEach(p=>{
    p.classList.remove('active');
    p.style.display='none';
  });
  const el = document.getElementById(id);
  el.style.display = 'block';
  el.classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
}

function startQuiz(){
  currentQ = 0; answers = [];
  showPage('page-quiz');
  renderQ(false);
}
function retryQuiz(){ showPage('page-lp'); }

// ===== QUIZ =====
function renderQ(back){
  const q    = QUESTIONS[currentQ];
  const body = document.getElementById('quiz-body');

  body.classList.remove('anim-in-right','anim-in-left');
  void body.offsetWidth;
  body.classList.add(back ? 'anim-in-left' : 'anim-in-right');

  document.getElementById('q-num').textContent    = 'Q' + (currentQ+1);
  document.getElementById('q-text').textContent   = q.q;
  document.getElementById('choice-a').textContent = q.a;
  document.getElementById('choice-b').textContent = q.b;

  const pct = (currentQ / QUESTIONS.length) * 100;
  document.getElementById('prog-fill').style.width = pct + '%';
  document.getElementById('prog-text').textContent = (currentQ+1)+' / '+QUESTIONS.length;

  document.getElementById('btn-back').disabled = (currentQ === 0);
}

function answer(ch){
  if(answers.length > currentQ) answers[currentQ] = ch;
  else answers.push(ch);

  if(currentQ < QUESTIONS.length-1){
    currentQ++;
    renderQ(false);
  } else {
    showResult();
  }
}

function goBack(){
  if(currentQ === 0) return;
  currentQ--;
  renderQ(true);
}

// ===== SCORING =====
function calcType(){
  const axisIdx = {
    empathy:[0,1,2,13],
    field:  [3,4,5],
    stable: [6,7],
    solo:   [8,9],
  };
  const scores = {};
  for(const [ax,idxs] of Object.entries(axisIdx)){
    const aCount = idxs.filter(i=>answers[i]==='A').length;
    scores[ax] = aCount / idxs.length;
  }
  const dom = {
    empathy: scores.empathy >= 0.5 ? 'A' : 'B',
    field:   scores.field   >= 0.5 ? 'A' : 'B',
    stable:  scores.stable  >= 0.5 ? 'A' : 'B',
    solo:    scores.solo    >= 0.5 ? 'A' : 'B',
  };
  const typeKey = dom.empathy + dom.field + dom.stable + dom.solo;
  const riskBs  = [10,11,12].filter(i=>answers[i]==='B').length;
  const riskLevel = riskBs >= 2 ? 'high' : riskBs === 1 ? 'mid' : 'low';
  return { typeKey, scores, riskLevel };
}

// ===== RESULT =====
function showResult(){
  const { typeKey, scores, riskLevel } = calcType();
  const t    = TYPES[typeKey] || TYPES['AAAA'];
  const risk = RISK_LEVELS[riskLevel];

  document.getElementById('r-archetype').textContent = t.archetype + ' — ' + ARCHETYPES[t.archetype];
  document.getElementById('r-typename').textContent  = t.name;
  document.getElementById('r-sub').textContent       = t.sub;
  document.getElementById('r-reason').textContent    = t.reason;

  const rb = document.getElementById('r-risk');
  rb.textContent = risk.text + '  ' + risk.note;
  rb.className   = 'risk-badge ' + risk.cls;

  document.getElementById('r-risks').innerHTML =
    t.risks.map(r=>`<li>${r}</li>`).join('');
  document.getElementById('r-tips').innerHTML  =
    t.tips.map(tp=>`<li>${tp}</li>`).join('');

  showPage('page-result');

  // axes animation (delay for page transition)
  setTimeout(()=>{
    setBar('ax-empathy', scores.empathy);
    setBar('ax-field',   scores.field);
    setBar('ax-stable',  scores.stable);
    setBar('ax-solo',    scores.solo);
  }, 80);
}

function setBar(id, ratio){
  const el = document.getElementById(id);
  if(el) el.style.width = Math.round(ratio*100) + '%';
}

// ===== SHARE =====
function buildText(){
  const { typeKey } = calcType();
  const t = TYPES[typeKey] || TYPES['AAAA'];
  return `【福祉職向け診断】\n私のタイプは「${t.name}」でした！\n原型：${t.archetype}\n\nあなたが辞めるのは"性格"か"職場"か診断\nhttps://fukushi-app.github.io/fukushi-shindan/\n\n#福祉職診断 #福祉職 #介護職`;
}

function shareX(){
  window.open(
    'https://twitter.com/intent/tweet?text=' + encodeURIComponent(buildText()),
    '_blank','noopener'
  );
}

function copyResult(){
  const btn  = document.getElementById('btn-copy');
  const text = buildText();
  const done = ()=>{
    btn.textContent = '✅ コピーしました';
    setTimeout(()=>{ btn.textContent = '📋 コピー'; }, 2000);
  };
  if(navigator.clipboard && window.isSecureContext){
    navigator.clipboard.writeText(text).then(done);
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    done();
  }
}
