// ---------- 動画データ ----------
// cat: song / game / collab / fun
const VIDEOS = [
  { id: 'KJXZpBp8wJI', t: '【ダンダダンOP】オトノケ Cover', cat: 'song' },
  { id: 'D-CJaAv33Ls', t: '圧倒的低音歌い手が モエチャッカファイア 歌ってみた', cat: 'song' },
  { id: 'BX5-yhk9tdM', t: '鬼ノ宴 歌ってみた', cat: 'song' },
  { id: 'Wkv9Dm-TdhQ', t: 'IRIS OUT / 米津玄師 歌ってみた', cat: 'song' },
  { id: 'Z5zfalj03ZA', t: '丸の内サディスティック / 椎名林檎 歌ってみた', cat: 'song' },
  { id: 'TuSCUSKVgLM', t: 'プロポーズ / なとり 歌ってみた', cat: 'song' },
  { id: 'GED7I6W6iQA', t: '圧倒的低音歌い手が プレイ(PLAY)歌ってみた', cat: 'song' },
  { id: 'RzCO5h8xVd8', t: 'セレナーデ 歌ってみた', cat: 'song' },
  { id: 'KACKoBy60Ao', t: '【壺おじ耐久】全然イライラしてないよ、まっじで', cat: 'game' },
  { id: 'RseAxbElHqM', t: '【Escape from Tarkov】俺の愛銃を見つけたい', cat: 'game' },
  { id: '7RZ7m1d0UbE', t: '【トルネコの大冒険】完全初見プレイでもクリアしたい', cat: 'game' },
  { id: 'MNHNN2eU0YY', t: '「呪われた農場」で化け物とダンスを踊れるホラーゲーム', cat: 'game' },
  { id: 'dPHTgayLMOo', t: '【BOMBANANA!】見ざる聞かざる言わざる他責ざる!【莉犬/あっと/しゆん】', cat: 'collab' },
  { id: 'HKyk0XowtiY', t: '【爆笑】STPRファミリーで飲酒マリカ杯やったら放送事故起きた', cat: 'collab' },
  { id: '-RVPOibbRD0', t: '【LOL/VALORANT】ただ るぅちゃんと遊ぶ', cat: 'collab' },
  { id: 'H6xwq2kbgFw', t: 'バレンタイン・キッス -piano arrange- 【あっと×しゆん×莉犬×たちばな】', cat: 'collab' },
  { id: 'dSZD4ibPt5Q', t: '【妹に運転を教える】無免許だけど妹に運転を教えてみる', cat: 'fun' },
  { id: 'NJRaJKgJ2gc', t: '【圧倒的No.1イケボ】「STPR面接」やってみたらイケボ過ぎて顔が流出した', cat: 'fun' },
  { id: 'd7-nMtN8Iyk', t: 'メンバーのサムネ制作屋さんします', cat: 'fun' },
  { id: 'fahhQnYJEug', t: '【眠】雑ノ談→タルコフ', cat: 'fun' },
];

const MVS = [
  { id: 'zHnhavpcXFk', t: 'ドープ' },
  { id: 'CDcsmYSZQFQ', t: 'マスカレードヴェール' },
  { id: 'x5N3MCtKV8M', t: 'シークレットディナー' },
  { id: 'o7uvrm9CwY8', t: 'HUE' },
  { id: 'QBCN8CHZWbA', t: 'マーダーホリック' },
  { id: 'RRb2VfqyL_E', t: 'A2A' },
];

const CAT = {
  song:   { label: '歌',       color: '#ffe4e8' },
  game:   { label: 'ゲーム',   color: '#e3ebff' },
  collab: { label: 'コラボ',   color: '#fff3c4' },
  fun:    { label: 'おもしろ', color: '#e0fbef' },
};

const titleOf = id => (VIDEOS.find(v => v.id === id) || MVS.find(v => v.id === id) || {}).t || '';
const thumb = (id, q = 'hqdefault') => `https://i.ytimg.com/vi/${id}/${q}.jpg`;
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---------- モーダルプレイヤー ----------
const modal = document.getElementById('modal');
const player = document.getElementById('player');

function play(id) {
  player.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
  document.getElementById('modalTitle').textContent = titleOf(id);
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}
function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  player.innerHTML = '';
}
document.getElementById('modalClose').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// data-play を持つ要素：サムネを出してクリックで再生
function wireThumbs(root = document) {
  root.querySelectorAll('.thumb[data-play]:not([data-ready])').forEach(el => {
    el.dataset.ready = '1';
    const q = el.classList.contains('big') ? 'maxresdefault' : 'hqdefault';
    el.innerHTML = `<img src="${thumb(el.dataset.play, q)}" alt="" loading="lazy"><span class="play"></span>`;
  });
}
document.addEventListener('click', e => {
  const t = e.target.closest('[data-play]');
  if (!t) return;
  e.preventDefault();
  e.stopPropagation();
  play(t.dataset.play);
});

// ---------- MUSIC ----------
document.getElementById('mvList').innerHTML = MVS.map((v, i) => `
  <button class="mv-item${i === 0 ? ' on' : ''}" data-mv="${v.id}">
    <img src="${thumb(v.id, 'mqdefault')}" alt="" loading="lazy">
    <span><small>MV</small>${esc(v.t)}</span>
  </button>`).join('');
document.getElementById('mvList').addEventListener('click', e => {
  const b = e.target.closest('[data-mv]');
  if (!b) return;
  const big = document.querySelector('.mv-feature .thumb.big');
  big.dataset.play = b.dataset.mv;
  big.querySelector('img').src = thumb(b.dataset.mv, 'maxresdefault');
  document.querySelectorAll('.mv-item').forEach(x => x.classList.toggle('on', x === b));
});

document.getElementById('coverRail').innerHTML = VIDEOS.filter(v => v.cat === 'song').map(v => `
  <div class="rail-item">
    <div class="thumb" data-play="${v.id}"></div>
    <p>${esc(v.t.replace(/ ?歌ってみた/, ''))}</p>
  </div>`).join('');

// ---------- LIBRARY ----------
const grid = document.getElementById('grid');
function renderGrid(cat) {
  const list = cat === 'all' ? VIDEOS : VIDEOS.filter(v => v.cat === cat);
  grid.innerHTML = list.map(v => `
    <article class="vcard pop-in">
      <div class="thumb" data-play="${v.id}"></div>
      <p class="cap">${esc(v.t)}</p>
      <span class="chip" style="background:${CAT[v.cat].color}">${CAT[v.cat].label}</span>
    </article>`).join('');
  wireThumbs(grid);
}
document.getElementById('filters').addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  document.querySelectorAll('#filters button').forEach(x => x.classList.toggle('on', x === b));
  renderGrid(b.dataset.cat);
});
renderGrid('all');

document.getElementById('omikuji').addEventListener('click', e => {
  e.stopPropagation();
  const all = [...VIDEOS, ...MVS];
  const btn = e.currentTarget;
  btn.classList.add('shake');
  setTimeout(() => {
    btn.classList.remove('shake');
    play(all[Math.floor(Math.random() * all.length)].id);
  }, 600);
});

wireThumbs();

// ---------- 好きなとこカード（裏返し） ----------
document.querySelectorAll('.flip').forEach(card => {
  card.addEventListener('click', e => {
    if (e.target.closest('[data-play]')) return;
    card.classList.toggle('flipped');
  });
});

// ---------- 応援ボード ----------
const NOTE_COLORS = ['#fff3c4', '#e3ebff', '#ffe4e8', '#efe6ff', '#e0fbef'];
const notesEl = document.getElementById('notes');
const DEFAULT_NOTES = ['いつも低音に癒やされてます！', '壺おじ耐久おつかれさま〜！', 'サムネ屋さんまたやってほしい🎨', 'MVの世界観だいすき！'];
let notes;
try { notes = JSON.parse(localStorage.getItem('atto-notes')) || DEFAULT_NOTES; } catch { notes = DEFAULT_NOTES; }

function renderNotes() {
  notesEl.innerHTML = '';
  notes.forEach((t, i) => {
    const d = document.createElement('div');
    d.className = 'note';
    d.textContent = t;
    d.style.background = NOTE_COLORS[i % NOTE_COLORS.length];
    d.style.setProperty('--r', `${(i % 2 ? 1 : -1) * (1.5 + (i % 3))}deg`);
    notesEl.appendChild(d);
  });
}
renderNotes();
document.getElementById('boardForm').addEventListener('submit', e => {
  e.preventDefault();
  const input = document.getElementById('msg');
  const text = input.value.trim();
  if (!text) return;
  notes = [text, ...notes].slice(0, 30);
  try { localStorage.setItem('atto-notes', JSON.stringify(notes)); } catch {}
  input.value = '';
  renderNotes();
});

// ---------- スクロールでふわっと出す ----------
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('show'); io.unobserve(en.target); }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---------- クリックでハート ----------
document.addEventListener('pointerdown', e => {
  if (e.target.closest('input, .modal')) return;
  const h = document.createElement('span');
  h.className = 'heart';
  h.textContent = ['❤️', '💙', '✨', '🎧', '@'][Math.floor(Math.random() * 5)];
  h.style.left = e.clientX - 10 + 'px';
  h.style.top = e.clientY - 10 + 'px';
  document.body.appendChild(h);
  setTimeout(() => h.remove(), 1000);
});
