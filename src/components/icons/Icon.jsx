// Mirrors the icon(name, stroke, size) helper from the original DC Component class,
// plus a few standalone glyphs (close/search/check/alert/clock/lock/download) that
// appeared as one-off inline <svg> in the source markup.
export default function Icon({ name, stroke = '#2e5a41', size = 20, strokeWidth = 1.7 }) {
  const p = (d, extra) => (
    <path d={d} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...extra} />
  )
  const ln = (x1, y1, x2, y2) => <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
  const c = (cx, cy, r) => <circle cx={cx} cy={cy} r={r} fill="none" stroke={stroke} strokeWidth={strokeWidth} />
  const r = (x, y, w, h) => <rect x={x} y={y} width={w} height={h} rx={1.5} fill="none" stroke={stroke} strokeWidth={strokeWidth} />

  let kids = null
  switch (name) {
    case 'grid':
      kids = <>{r(3, 3, 7, 7)}{r(14, 3, 7, 7)}{r(3, 14, 7, 7)}{r(14, 14, 7, 7)}</>
      break
    case 'leaf':
      kids = <>{p('M4 12C4 6 9 4 20 4c0 11-6 16-12 16-5 0-4-8-4-8z')}{p('M9 16c2-4 5-6 9-7')}</>
      break
    case 'doc':
      kids = <>{p('M6 3h8l4 4v14H6z')}{p('M14 3v4h4')}{ln(9, 12, 15, 12)}{ln(9, 16, 14, 16)}</>
      break
    case 'truck':
      kids = <>{r(2, 7, 12, 8)}{p('M14 10h4l3 3v2h-7z')}{c(7, 19, 1.7)}{c(18, 19, 1.7)}{ln(9, 19, 16, 19)}</>
      break
    case 'card':
      kids = <>{r(3, 5, 18, 14)}{ln(3, 9, 21, 9)}{ln(6, 15, 10, 15)}</>
      break
    case 'mountain':
      kids = p('M3 19l6-9 4 5 3-4 5 8z')
      break
    case 'sprout':
      kids = <>{ln(12, 20, 12, 11)}{p('M12 13C12 9 9 8 5 8c0 4 3 5 7 5z')}{p('M12 12c0-3 2-4 6-4 0 3-2 4-6 4z')}</>
      break
    case 'chart':
      kids = <>{p('M4 4v16h16')}{p('M7 15l3-4 3 2 4-6')}</>
      break
    case 'pin':
      kids = <>{p('M12 22s7-6 7-12A7 7 0 105 10c0 6 7 12 7 12z')}{c(12, 10, 2.5)}</>
      break
    case 'gear':
      kids = <>{c(12, 12, 3)}{p('M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1')}</>
      break
    case 'bell':
      kids = <>{p('M6 16V11a6 6 0 0112 0v5l1.5 2H4.5z')}{p('M10 20a2 2 0 004 0')}</>
      break
    case 'close':
      kids = <>{ln(6, 6, 18, 18)}{ln(18, 6, 6, 18)}</>
      break
    case 'search':
      kids = <>{c(11, 11, 7)}{ln(16.5, 16.5, 21, 21)}</>
      break
    case 'check':
      kids = p('M5 12l4 4L19 7')
      break
    case 'alert':
      kids = <>{c(12, 12, 9)}{ln(12, 8, 12, 13)}{ln(12, 16.5, 12, 16.6)}</>
      break
    case 'clock':
      kids = <>{c(12, 12, 9)}{p('M12 8v4l3 2')}</>
      break
    case 'lock':
      kids = <>{r(4, 10, 16, 11)}{p('M8 10V7a4 4 0 018 0v3')}</>
      break
    case 'download':
      kids = <>{p('M12 4v11')}{p('M7 11l5 5 5-5')}{p('M5 20h14')}</>
      break
    default:
      kids = null
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block', flex: '0 0 auto' }}>
      {kids}
    </svg>
  )
}
