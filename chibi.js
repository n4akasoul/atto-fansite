// あっとくんのデフォルメファンアート（SVG・全身2.5頭身）
// 特徴：黒→赤グラデの髪、赤と青のオッドアイ、目元のスペードと▼、@ピアス、赤いロングコート
// chibi({ face, prop }) で表情とポーズを切り替えられる
//   face: 'smile' | 'sing' | 'wink' | 'sleepy' | 'smug' | 'wow' | 'gentle' | 'huh'
//   prop: null | 'mic' | 'game' | 'pen' | 'heart' | 'wave' | 'chin'

const C = {
  ink: '#3a2630',
  hairTop: '#2a1e25',
  hairTip: '#d62a46',
  skin: '#fff1ea',
  skinShade: '#f6d9cf',
  coat: '#c8243c',
  coatShade: '#9e1a2f',
  dark: '#2a2228',
  gold: '#e8b64a',
  blush: '#ff9fb0',
  red: '#ff4d5e',
  blue: '#4d8dff',
};

let uid = 0;
// 前髪：毛先が右から左へ流れるカーブした毛束
const BANGS = (() => {
  const tips = [[156, 116], [140, 104], [122, 100], [101, 114], [82, 100], [64, 108], [48, 130]];
  const vals = [[146, 82], [130, 80], [112, 78], [92, 80], [74, 82], [58, 88]];
  let d = 'M40 122 Q30 58 72 38 Q100 26 132 36 Q170 54 163 122 ';
  d += `Q160 ${118} ${tips[0][0]} ${tips[0][1]} `;
  vals.forEach(([vx, vy], i) => {
    const [tx, ty] = tips[i + 1];
    d += `Q${vx + 6} ${(vy + tips[i][1]) / 2} ${vx} ${vy} `;
    d += `Q${vx - 2} ${(vy + ty) / 2 + 6} ${tx} ${ty} `;
  });
  return d + 'Z';
})();

const S = `stroke="${C.ink}" stroke-linejoin="round" stroke-linecap="round"`;

// ---------- 目 ----------
function eye(cx, cy, iris, id) {
  return `
    <ellipse cx="${cx}" cy="${cy}" rx="12" ry="15" fill="#fff"/>
    <ellipse cx="${cx}" cy="${cy + 2}" rx="10.5" ry="13.5" fill="url(#iris-${iris}-${id})"/>
    <ellipse cx="${cx}" cy="${cy + 3}" rx="4.5" ry="6" fill="${C.ink}" opacity=".85"/>
    <circle cx="${cx + 3.5}" cy="${cy - 4}" r="4.2" fill="#fff"/>
    <circle cx="${cx - 4}" cy="${cy + 7}" r="2" fill="#fff" opacity=".9"/>
    <path d="M${cx - 14} ${cy - 8} Q${cx - 2} ${cy - 19} ${cx + 14} ${cy - 10} L${cx + 17} ${cy - 13}" fill="none" ${S} stroke-width="4.2"/>
    <path d="M${cx - 6} ${cy + 15} Q${cx} ${cy + 16.5} ${cx + 6} ${cy + 15}" fill="none" ${S} stroke-width="1.6" opacity=".6"/>`;
}
const arc = (cx, cy, up) => up
  ? `<path d="M${cx - 11} ${cy + 3} Q${cx} ${cy - 9} ${cx + 11} ${cy + 3}" fill="none" ${S} stroke-width="4"/>`
  : `<path d="M${cx - 11} ${cy} Q${cx} ${cy + 8} ${cx + 11} ${cy}" fill="none" ${S} stroke-width="4"/>`;
const halfLid = (cx, cy) => `
    <path d="M${cx - 15} ${cy - 19} H${cx + 15} V${cy - 4} Q${cx} ${cy - 8} ${cx - 15} ${cy - 4} Z" fill="${C.skin}"/>
    <path d="M${cx - 15} ${cy - 4} Q${cx} ${cy - 8} ${cx + 16} ${cy - 5}" fill="none" ${S} stroke-width="4.2"/>`;

function eyes(face, id) {
  const L = [78, 110], R = [122, 110];
  switch (face) {
    case 'gentle': return arc(...L, true) + arc(...R, true);
    case 'sleepy': return arc(...L, false) + arc(...R, false);
    case 'wink':   return eye(...L, 'r', id) + arc(...R, true);
    case 'smug':   return eye(...L, 'r', id) + eye(...R, 'b', id) + halfLid(...L) + halfLid(...R);
    default:       return eye(...L, 'r', id) + eye(...R, 'b', id);
  }
}

function brows(face) {
  if (face === 'huh') return `<path d="M68 86 Q78 80 88 85 M112 85 Q122 80 132 86" fill="none" ${S} stroke-width="2.5"/>`;
  if (face === 'smug') return `<path d="M68 88 L88 91 M112 91 L132 88" fill="none" ${S} stroke-width="2.5"/>`;
  return '';
}

// ---------- 口 ----------
function mouth(face) {
  const open = `<path d="M90 135 Q100 150 110 135 Z" fill="#8e2236" ${S} stroke-width="2"/><ellipse cx="100" cy="143" rx="4.5" ry="2.5" fill="#ff8a9a"/>`;
  switch (face) {
    case 'sing':   return `<ellipse cx="100" cy="140" rx="6" ry="7.5" fill="#8e2236" ${S} stroke-width="2"/><ellipse cx="100" cy="144" rx="3.5" ry="2" fill="#ff8a9a"/>`;
    case 'wow':    return `<ellipse cx="100" cy="140" rx="4.5" ry="5.5" fill="#8e2236" ${S} stroke-width="2"/>`;
    case 'huh':    return `<path d="M94 140 Q97 137 100 140 Q103 143 106 140" fill="none" ${S} stroke-width="2.2"/>`;
    case 'sleepy': return `<ellipse cx="100" cy="140" rx="3" ry="2.5" fill="#8e2236" ${S} stroke-width="1.8"/>`;
    case 'smug':   return `<path d="M91 139 Q101 145 110 135" fill="none" ${S} stroke-width="2.4"/>`;
    case 'gentle': return `<path d="M93 138 Q100 144 107 138" fill="none" ${S} stroke-width="2.4"/>`;
    default:       return open;
  }
}

// ---------- 腕 ----------
function arm(x1, y1, x2, y2, fist = false) {
  const cx = x1 + (x2 - x1) * .78, cy = y1 + (y2 - y1) * .78;
  return `
    <path d="M${x1} ${y1} L${x2} ${y2}" stroke="${C.ink}" stroke-width="17" stroke-linecap="round"/>
    <path d="M${x1} ${y1} L${x2} ${y2}" stroke="${C.coat}" stroke-width="12.5" stroke-linecap="round"/>
    <path d="M${cx} ${cy} L${x1 + (x2 - x1) * .9} ${y1 + (y2 - y1) * .9}" stroke="${C.dark}" stroke-width="13"/>
    <circle cx="${x2}" cy="${y2}" r="${fist ? 7.5 : 6.5}" fill="${C.skin}" ${S} stroke-width="2.2"/>`;
}

function arms(p) {
  const L = arm(76, 164, 62, 208), R = arm(124, 164, 138, 208);
  switch (p) {
    case 'wave':  return L + `<g class="wave-hand">${arm(124, 164, 150, 128)}</g>`;
    case 'chin':  return L + arm(126, 166, 116, 150, true);
    case 'heart': return arm(76, 164, 90, 194) + arm(124, 164, 110, 194);
    case 'game':  return arm(76, 164, 84, 202) + arm(124, 164, 116, 202);
    case 'mic':   return L + arm(126, 166, 127, 177, true);
    case 'pen':   return L + arm(124, 164, 142, 196);
    default:      return L + R;
  }
}

function prop(p) {
  switch (p) {
    case 'mic': return `
      <path d="M126 176 L119 158" stroke="${C.dark}" stroke-width="6" stroke-linecap="round"/>
      <circle cx="117" cy="152" r="8" fill="#c9c3d6" ${S} stroke-width="2.2"/>
      <path d="M111 150 H123 M111 154 H123" stroke="${C.ink}" stroke-width="1.2" opacity=".5"/>
      <circle cx="127" cy="177" r="7.5" fill="${C.skin}" ${S} stroke-width="2.2"/>`;
    case 'heart': return `
      <path d="M100 206 L84 190 Q77 181 85 175 Q93 171 100 180 Q107 171 115 175 Q123 181 116 190 Z" fill="${C.red}" ${S} stroke-width="2.4"/>
      <circle cx="89" cy="182" r="2.5" fill="#fff" opacity=".8"/>
      <circle cx="90" cy="194" r="6.5" fill="${C.skin}" ${S} stroke-width="2.2"/><circle cx="110" cy="194" r="6.5" fill="${C.skin}" ${S} stroke-width="2.2"/>`;
    case 'game': return `
      <g transform="translate(100 204)">
        <path d="M-24 -8 Q-24 -14 -16 -14 H16 Q24 -14 24 -8 L28 6 Q29 13 22 12 L13 5 H-13 L-22 12 Q-29 13 -28 6 Z" fill="#fff" ${S} stroke-width="2.4"/>
        <path d="M-15 -6 V2 M-19 -2 H-11" stroke="${C.ink}" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="13" cy="-5" r="2.5" fill="${C.red}"/><circle cx="18" cy="0" r="2.5" fill="${C.blue}"/>
      </g>
      <circle cx="84" cy="202" r="6.5" fill="${C.skin}" ${S} stroke-width="2.2"/><circle cx="116" cy="202" r="6.5" fill="${C.skin}" ${S} stroke-width="2.2"/>`;
    case 'pen': return `
      <g transform="rotate(28 142 196)"><rect x="138" y="168" width="8" height="34" rx="3" fill="${C.gold}" ${S} stroke-width="2"/>
      <path d="M138 202 L142 212 L146 202 Z" fill="${C.skin}" ${S} stroke-width="2"/></g>
      <circle cx="142" cy="196" r="6.5" fill="${C.skin}" ${S} stroke-width="2.2"/>`;
    default: return '';
  }
}

// ---------- 飾り ----------
function deco(face) {
  switch (face) {
    case 'huh': return `
      <text x="150" y="58" font-size="30" font-weight="900" fill="${C.blue}" font-family="Arial, sans-serif" transform="rotate(12 150 58)">?</text>
      <path d="M154 86 Q160 96 154 100 Q148 96 154 86 Z" fill="#9fd4ff" ${S} stroke-width="1.6"/>`;
    case 'smug': return `<text x="148" y="60" font-size="22" fill="${C.gold}">✦</text><text x="40" y="54" font-size="14" fill="${C.gold}">✦</text>`;
    case 'gentle': return `<text x="148" y="60" font-size="22" fill="${C.blush}">♡</text>`;
    case 'sleepy': return `<text class="zzz" x="148" y="54" font-size="24" font-weight="900" fill="${C.blue}" font-family="Arial, sans-serif">z<tspan font-size="16" dy="-9">z</tspan></text>`;
    case 'sing': return `<text x="36" y="90" font-size="22" fill="${C.blue}">♪</text><text x="152" y="70" font-size="18" fill="${C.red}">♫</text>`;
    default: return '';
  }
}

function chibi({ face = 'smile', prop: p = null, className = '' } = {}) {
  const id = ++uid;
  const tilt = face === 'huh' ? 'rotate(-7 100 110)' : face === 'wink' ? 'rotate(4 100 110)' : '';
  return `
<svg class="chibi ${className}" viewBox="0 0 200 272" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="あっとくんのファンアート">
  <defs>
    <linearGradient id="hair-${id}" gradientUnits="userSpaceOnUse" x1="0" y1="40" x2="0" y2="118">
      <stop offset="0" stop-color="${C.hairTop}"/><stop offset=".45" stop-color="#3a1c26"/><stop offset=".8" stop-color="#a3203a"/><stop offset="1" stop-color="${C.hairTip}"/>
    </linearGradient>
    <linearGradient id="iris-r-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6e0d20"/><stop offset="1" stop-color="${C.red}"/></linearGradient>
    <linearGradient id="iris-b-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16287a"/><stop offset="1" stop-color="#6aa8ff"/></linearGradient>
  </defs>

  <!-- 体（赤いロングコート） -->
  <g class="body">
    <path d="M86 244 L85 262 M114 244 L115 262" stroke="${C.dark}" stroke-width="11" stroke-linecap="round"/>
    <ellipse cx="83" cy="264" rx="9" ry="5" fill="${C.dark}"/><ellipse cx="117" cy="264" rx="9" ry="5" fill="${C.dark}"/>
    <path d="M74 158 Q100 150 126 158 L136 202 L148 244 Q100 254 52 244 L64 202 Z" fill="${C.coat}" ${S} stroke-width="2.5"/>
    <path d="M100 200 L96 250 L104 250 Z" fill="${C.dark}"/>
    <path d="M55 240 Q100 250 145 240" fill="none" stroke="${C.dark}" stroke-width="4"/>
    <path d="M136 202 L148 244 Q140 246 132 247 Z" fill="${C.coatShade}" opacity=".6"/>
    <path d="M91 156 L100 196 L109 156 Q100 153 91 156 Z" fill="${C.dark}" ${S} stroke-width="2"/>
    <path d="M100 160 L100 184" stroke="${C.hairTip}" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M91 156 L84 200 M109 156 L116 200" fill="none" stroke="${C.dark}" stroke-width="2.5"/>
    <circle cx="89" cy="206" r="2.5" fill="${C.gold}"/><circle cx="89" cy="218" r="2.5" fill="${C.gold}"/>
    <circle cx="111" cy="206" r="2.5" fill="${C.gold}"/><circle cx="111" cy="218" r="2.5" fill="${C.gold}"/>
    <path d="M70 226 l5 -6 l5 6 l-5 6 z" fill="${C.dark}"/>
    ${arms(p)}
  </g>

  <!-- 頭 -->
  <g class="head" transform="${tilt}">
    <!-- 後ろ髪 -->
    <path d="M36 120 Q22 70 44 52 Q60 30 100 30 Q140 30 156 52 Q178 70 164 120 L167 146 L155 130 L151 150 L140 134 L60 134 L49 150 L45 130 L33 146 Z" fill="url(#hair-${id})" ${S} stroke-width="2.5"/>
    <!-- 顔 -->
    <path d="M44 102 Q44 54 100 52 Q156 54 156 102 Q156 140 124 152 Q100 158 76 152 Q44 140 44 102 Z" fill="${C.skin}" ${S} stroke-width="2.5"/>
    <path d="M56 70 Q100 60 146 72 L146 84 Q100 76 56 86 Z" fill="${C.skinShade}" opacity=".7"/>
    <!-- 耳と@ピアス -->
    <ellipse cx="156" cy="116" rx="6.5" ry="9" fill="${C.skin}" ${S} stroke-width="2.2"/>
    <line x1="157" y1="125" x2="157" y2="131" stroke="${C.gold}" stroke-width="2"/>
    <circle cx="157" cy="138" r="7" fill="${C.gold}" ${S} stroke-width="1.8"/>
    <text x="157" y="141.5" text-anchor="middle" font-size="9.5" font-weight="900" fill="${C.ink}" font-family="Arial, sans-serif">@</text>
    <!-- ほっぺ -->
    <ellipse cx="62" cy="130" rx="9" ry="4.5" fill="${C.blush}" opacity=".6"/>
    <ellipse cx="140" cy="130" rx="9" ry="4.5" fill="${C.blush}" opacity=".6"/>
    <!-- 目 -->
    <g class="eyes">${eyes(face, id)}</g>
    ${brows(face)}
    <!-- 目元のスペード（赤い目側）と▼▼▼（青い目側） -->
    <path d="M72 128 Q67 133 69.5 136 Q72 138 73.5 135.5 L72.8 140 L76.2 140 L75.5 135.5 Q77 138 79.5 136 Q82 133 77 128 Q74.5 125.5 72 128 Z" fill="${C.ink}"/>
    <path d="M119 130 h5 l-2.5 4z M126 130 h5 l-2.5 4z M133 130 h5 l-2.5 4z" fill="${C.ink}"/>
    ${mouth(face)}
    <!-- 前髪（黒から赤へ） -->
    <path d="${BANGS}" fill="url(#hair-${id})" ${S} stroke-width="2.5"/>
    <path d="M62 56 Q90 42 124 48" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".22"/>
    <!-- アホ毛 -->
    <path d="M104 34 Q110 12 126 16 Q113 20 112 36" fill="${C.hairTop}" ${S} stroke-width="2.2"/>
  </g>

  ${prop(p)}
  ${deco(face)}
</svg>`;
}

// data-chibi="face,prop" を持つ要素にイラストを差し込む
document.querySelectorAll('[data-chibi]').forEach(el => {
  const [face, p] = el.dataset.chibi.split(',');
  el.innerHTML = chibi({ face, prop: p || null });
});
