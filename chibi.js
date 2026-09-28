// あっとくんのデフォルメファンアート（SVG）
// 特徴：赤髪・赤と青のオッドアイ・目元のスペードと▼▼▼・@ピアス・黒ジャケット
// chibi({ face, prop }) で表情と持ち物を切り替えられる
//   face: 'smile' | 'sing' | 'wink' | 'sleepy' | 'smug' | 'wow'
//   prop: null | 'mic' | 'game' | 'pen' | 'heart' | 'wave'

const C = {
  ink: '#2e2433',
  hair: '#c42140',
  hairDark: '#8e1330',
  hairLight: '#ff5a70',
  skin: '#fff3ec',
  red: '#ff3355',
  blue: '#3f6dff',
  jacket: '#2e2433',
  blush: '#ffb0bf',
  gold: '#ffc83d',
};

let uid = 0;

function eye(cx, cy, color, id) {
  return `
    <ellipse cx="${cx}" cy="${cy}" rx="12.5" ry="15.5" fill="#fff" stroke="${C.ink}" stroke-width="3"/>
    <ellipse cx="${cx}" cy="${cy + 1.5}" rx="10" ry="13" fill="url(#iris-${color === C.red ? 'r' : 'b'}-${id})"/>
    <ellipse cx="${cx}" cy="${cy + 3}" rx="4.5" ry="6" fill="${C.ink}"/>
    <circle cx="${cx + 4}" cy="${cy - 5}" r="4" fill="#fff"/>
    <circle cx="${cx - 4}" cy="${cy + 7}" r="2" fill="#fff" opacity=".9"/>
    <path d="M${cx - 14} ${cy - 13} Q${cx} ${cy - 22} ${cx + 14} ${cy - 13}" fill="none" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>`;
}

function closedEye(cx, cy, happy) {
  // happy: ^ の形 / そうでなければ眠そうな ‿
  return happy
    ? `<path d="M${cx - 11} ${cy + 3} Q${cx} ${cy - 10} ${cx + 11} ${cy + 3}" fill="none" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>`
    : `<path d="M${cx - 11} ${cy} Q${cx} ${cy + 8} ${cx + 11} ${cy}" fill="none" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>`;
}

function eyes(face, id) {
  const L = [76, 110], R = [124, 110];
  if (face === 'sleepy') return closedEye(...L, false) + closedEye(...R, false);
  if (face === 'wink') return eye(...L, C.red, id) + closedEye(...R, true);
  let s = eye(...L, C.red, id) + eye(...R, C.blue, id);
  if (face === 'smug') {
    // 半目のまぶた
    s += `<path d="M62 101 Q76 94 90 101 L90 96 L62 96Z" fill="${C.skin}"/>
          <path d="M110 101 Q124 94 138 101 L138 96 L110 96Z" fill="${C.skin}"/>
          <path d="M62 102 Q76 96 90 102 M110 102 Q124 96 138 102" fill="none" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>`;
  }
  return s;
}

function mouth(face) {
  switch (face) {
    case 'sing':   return `<ellipse cx="100" cy="141" rx="8" ry="9" fill="#8e1330" stroke="${C.ink}" stroke-width="3"/><ellipse cx="100" cy="145" rx="4.5" ry="3" fill="#ff8fa3"/>`;
    case 'wow':    return `<ellipse cx="100" cy="142" rx="5" ry="6" fill="#8e1330" stroke="${C.ink}" stroke-width="3"/>`;
    case 'sleepy': return `<ellipse cx="100" cy="141" rx="3.5" ry="3" fill="#8e1330" stroke="${C.ink}" stroke-width="2.5"/>`;
    case 'smug':   return `<path d="M90 138 Q102 146 112 134" fill="none" stroke="${C.ink}" stroke-width="3.5" stroke-linecap="round"/>`;
    default:       return `<path d="M88 136 Q100 150 112 136 Z" fill="#fff" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>`;
  }
}

function prop(p) {
  const hand = (x, y) => `<circle cx="${x}" cy="${y}" r="11" fill="${C.skin}" stroke="${C.ink}" stroke-width="3.5"/>`;
  switch (p) {
    case 'mic': return `
      <g transform="translate(6 16) rotate(-18 150 200)">
        <rect x="143" y="178" width="14" height="44" rx="6" fill="${C.ink}"/>
        <circle cx="150" cy="170" r="17" fill="#c9c3d6" stroke="${C.ink}" stroke-width="3.5"/>
        <path d="M137 166 H163 M139 174 H161" stroke="${C.ink}" stroke-width="2" opacity=".5"/>
        <rect x="140" y="184" width="20" height="5" fill="${C.red}"/>
      </g>${hand(156, 216)}`;
    case 'game': return `
      <g transform="translate(100 206)">
        <path d="M-40 -14 Q-40 -24 -28 -24 H28 Q40 -24 40 -14 L46 12 Q48 24 36 22 L22 10 H-22 L-36 22 Q-48 24 -46 12 Z" fill="#fff" stroke="${C.ink}" stroke-width="3.5" stroke-linejoin="round"/>
        <path d="M-26 -10 V2 M-32 -4 H-20" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>
        <circle cx="22" cy="-8" r="4" fill="${C.red}"/><circle cx="30" cy="0" r="4" fill="${C.blue}"/>
      </g>${hand(58, 204)}${hand(142, 204)}`;
    case 'pen': return `
      <g transform="rotate(30 150 190)">
        <rect x="144" y="150" width="12" height="56" rx="4" fill="${C.gold}" stroke="${C.ink}" stroke-width="3"/>
        <path d="M144 206 L150 222 L156 206 Z" fill="${C.skin}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>
      </g>${hand(146, 196)}`;
    case 'heart': return `
      <path d="M100 232 L72 204 Q60 188 74 178 Q88 170 100 186 Q112 170 126 178 Q140 188 128 204 Z" fill="${C.red}" stroke="${C.ink}" stroke-width="3.5" stroke-linejoin="round"/>
      <circle cx="82" cy="190" r="4" fill="#fff" opacity=".8"/>${hand(72, 208)}${hand(128, 208)}`;
    case 'wave': return `
      <path d="M150 196 Q170 180 176 156" fill="none" stroke="${C.jacket}" stroke-width="20" stroke-linecap="round"/>
      <g class="wave-hand">${hand(178, 150)}</g>`;
    default: return '';
  }
}

function chibi({ face = 'smile', prop: p = null, className = '' } = {}) {
  const id = ++uid;
  return `
<svg class="chibi ${className}" viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="あっとくんのファンアート">
  <defs>
    <linearGradient id="hair-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${C.hairDark}"/><stop offset=".55" stop-color="${C.hair}"/><stop offset="1" stop-color="${C.hairLight}"/>
    </linearGradient>
    <radialGradient id="iris-r-${id}" cy=".35"><stop offset="0" stop-color="#ff9aa9"/><stop offset="1" stop-color="${C.red}"/></radialGradient>
    <radialGradient id="iris-b-${id}" cy=".35"><stop offset="0" stop-color="#9fb8ff"/><stop offset="1" stop-color="${C.blue}"/></radialGradient>
  </defs>

  <!-- 後ろ髪 -->
  <path d="M34 128 Q22 40 100 30 Q178 40 166 128 Q160 150 150 156 L50 156 Q40 150 34 128Z" fill="url(#hair-${id})" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/>

  <!-- 体（黒ジャケット＋白シャツ） -->
  <path d="M36 240 Q38 176 100 166 Q162 176 164 240Z" fill="${C.jacket}" stroke="${C.ink}" stroke-width="4"/>
  <path d="M80 170 L100 206 L120 170 Q100 164 80 170Z" fill="#fff" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>
  <path d="M72 176 L92 214 M128 176 L108 214" stroke="#4a4050" stroke-width="3"/>

  <!-- 顔 -->
  <path d="M42 104 Q42 58 100 56 Q158 58 158 104 Q158 150 124 164 Q100 172 76 164 Q42 150 42 104Z" fill="${C.skin}" stroke="${C.ink}" stroke-width="4"/>

  <!-- 耳と@ピアス -->
  <ellipse cx="158" cy="118" rx="8" ry="11" fill="${C.skin}" stroke="${C.ink}" stroke-width="3.5"/>
  <line x1="159" y1="129" x2="159" y2="136" stroke="${C.gold}" stroke-width="2.5"/>
  <circle cx="159" cy="144" r="9" fill="${C.gold}" stroke="${C.ink}" stroke-width="2.5"/>
  <text x="159" y="148.5" text-anchor="middle" font-size="12" font-weight="900" fill="${C.ink}" font-family="Arial, sans-serif">@</text>

  <!-- 目 -->
  <g class="eyes">${eyes(face, id)}</g>

  <!-- 目元のスペード（赤い目側）と▼▼▼（青い目側） -->
  <path d="M70 128 Q64 134 67 138 Q70 140 72 137 L71 142 L75 142 L74 137 Q76 140 79 138 Q82 134 76 128 Q73 125 70 128Z" fill="${C.ink}" transform="translate(-3 0) scale(1)"/>
  <path d="M116 131 h7 l-3.5 5z M125 131 h7 l-3.5 5z M134 131 h7 l-3.5 5z" fill="${C.ink}"/>

  <!-- ほっぺ -->
  <ellipse cx="60" cy="141" rx="10" ry="5.5" fill="${C.blush}" opacity=".85"/>
  <ellipse cx="140" cy="143" rx="10" ry="5.5" fill="${C.blush}" opacity=".85"/>

  <!-- 口 -->
  ${mouth(face)}

  <!-- 前髪（右に流れるギザギザ前髪） -->
  <path d="M36 112 Q30 46 92 34 Q150 26 168 78 Q172 96 164 116 L156 88 L150 100 L140 78 L128 94 L120 72 L104 90 L100 68 L84 90 L80 66 L64 94 L60 74 L46 106 Z"
        fill="url(#hair-${id})" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/>
  <path d="M70 50 Q92 40 116 44" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".45"/>
  <!-- アホ毛 -->
  <path d="M104 34 Q112 10 128 16 Q114 20 112 36" fill="${C.hair}" stroke="${C.ink}" stroke-width="3.5" stroke-linejoin="round"/>

  ${prop(p)}
  ${face === 'sleepy' ? `<text class="zzz" x="150" y="54" font-size="26" font-weight="900" fill="${C.blue}" font-family="Arial, sans-serif">z<tspan font-size="18" dy="-10">z</tspan></text>` : ''}
</svg>`;
}

// data-chibi="face,prop" を持つ要素にイラストを差し込む
document.querySelectorAll('[data-chibi]').forEach(el => {
  const [face, p] = el.dataset.chibi.split(',');
  el.innerHTML = chibi({ face, prop: p || null });
});
