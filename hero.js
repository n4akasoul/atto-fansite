// トップ：公式MVのサビ30秒を順番に流す（YouTube IFrame API）
// start/end は YouTube の「よく再生されている部分」から選んだ 30 秒
const HERO_MVS = [
  { id: 'zHnhavpcXFk', t: 'ドープ',               start: 122, end: 152 },
  { id: 'CDcsmYSZQFQ', t: 'マスカレードヴェール', start: 161, end: 191 },
  { id: 'QBCN8CHZWbA', t: 'マーダーホリック',     start: 99,  end: 129 },
  { id: 'x5N3MCtKV8M', t: 'シークレットディナー', start: 166, end: 196 },
  { id: 'o7uvrm9CwY8', t: 'HUE',                  start: 156, end: 186 },
  { id: 'RRb2VfqyL_E', t: 'A2A',                  start: 129, end: 159 },
];

(() => {
  const $ = id => document.getElementById(id);
  const poster = $('heroPoster'), title = $('heroTitle'), bar = $('heroBar');
  const dots = $('heroDots'), soundBtn = $('heroSound');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let idx = 0, yt = null, ready = false, muted = true;
  let switching = false; // 切り替え中に届く古い「終了」イベントを無視する

  dots.innerHTML = HERO_MVS.map((m, i) => `<button type="button" data-i="${i}" aria-label="${m.t}" title="${m.t}"></button>`).join('');

  function show(i) {
    idx = (i + HERO_MVS.length) % HERO_MVS.length;
    const m = HERO_MVS[idx];
    title.textContent = m.t;
    poster.src = `https://i.ytimg.com/vi/${m.id}/maxresdefault.jpg`;
    poster.classList.remove('hide');
    [...dots.children].forEach((d, j) => d.classList.toggle('on', j === idx));
    bar.style.width = '0';
    if (ready) {
      switching = true;
      yt.loadVideoById({ videoId: m.id, startSeconds: m.start, endSeconds: m.end });
    }
  }

  dots.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (b) show(+b.dataset.i);
  });

  $('heroFull').addEventListener('click', () => {
    if (yt && ready) yt.pauseVideo();
    play(HERO_MVS[idx].id); // main.js のモーダルで最初から再生
  });

  soundBtn.addEventListener('click', () => {
    if (!ready) return;
    muted = !muted;
    muted ? yt.mute() : yt.unMute();
    soundBtn.textContent = muted ? '🔇 音を出す' : '🔊 音を消す';
    soundBtn.classList.toggle('on', !muted);
  });

  // モーダルを閉じたら背景MVを再開
  new MutationObserver(() => {
    if (ready && !document.getElementById('modal').classList.contains('open')) yt.playVideo();
  }).observe(document.getElementById('modal'), { attributes: true, attributeFilter: ['class'] });

  // 30秒のどこまで進んだかをバーで表示
  setInterval(() => {
    if (!ready || typeof yt.getCurrentTime !== 'function') return;
    const m = HERO_MVS[idx];
    const p = Math.min(1, Math.max(0, (yt.getCurrentTime() - m.start) / (m.end - m.start)));
    bar.style.width = p * 100 + '%';
  }, 250);

  show(0);
  if (reduceMotion) return; // 動きを減らす設定の人には自動再生しない（ポスター画像のみ）

  window.onYouTubeIframeAPIReady = () => {
    const m = HERO_MVS[idx];
    yt = new YT.Player('heroPlayer', {
      videoId: m.id,
      playerVars: {
        autoplay: 1, mute: 1, controls: 0, disablekb: 1, fs: 0, playsinline: 1,
        rel: 0, iv_load_policy: 3, start: m.start, end: m.end,
      },
      events: {
        onReady: e => { ready = true; e.target.mute(); e.target.playVideo(); },
        onStateChange: e => {
          if (e.data === YT.PlayerState.PLAYING) { switching = false; poster.classList.add('hide'); }
          if (e.data === YT.PlayerState.ENDED && !switching) show(idx + 1); // 次のMVへ
        },
      },
    });
  };
  const s = document.createElement('script');
  s.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(s);
})();
