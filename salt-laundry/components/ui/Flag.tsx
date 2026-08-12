import { useId } from 'react'
import type { LanguageCode } from '@/lib/constants/languages'

interface FlagProps {
  code: LanguageCode
  className?: string
}

export function Flag({ code, className = 'w-5 h-auto rounded-xs' }: FlagProps) {
  switch (code) {
    case 'FR':
      return <FranceFlag className={className} />
    case 'RW':
      return <RwandaFlag className={className} />
    case 'EN':
    default:
      return <UnionJackFlag className={className} />
  }
}

function FranceFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 3 2" className={className} role="img" aria-hidden="true">
      <rect width="3" height="2" fill="#fff" />
      <rect width="1" height="2" x="0" fill="#0055A4" />
      <rect width="1" height="2" x="2" fill="#EF4135" />
    </svg>
  )
}

function RwandaFlag({ className }: { className?: string }) {
  const cx = 4.75
  const cy = 1
  const r = 0.32
  const rays = Array.from({ length: 24 }, (_, i) => {
    const a = (i * 15 * Math.PI) / 180
    return (
      <line
        key={i}
        x1={cx + Math.cos(a) * (r + 0.05)}
        y1={cy + Math.sin(a) * (r + 0.05)}
        x2={cx + Math.cos(a) * (r + 0.24)}
        y2={cy + Math.sin(a) * (r + 0.24)}
        stroke="#E5BE01"
        strokeWidth="0.05"
      />
    )
  })
  return (
    <svg viewBox="0 0 6 4" className={className} role="img" aria-hidden="true">
      <rect width="6" height="2" y="0" fill="#00A1DE" />
      <rect width="6" height="1" y="2" fill="#FAD201" />
      <rect width="6" height="1" y="3" fill="#20603D" />
      {rays}
      <circle cx={cx} cy={cy} r={r} fill="#E5BE01" />
    </svg>
  )
}

function UnionJackFlag({ className }: { className?: string }) {
  // Unique clip ids per instance — duplicate ids across SVGs break references in
  // some browsers (both flags would resolve to the first one's clip path).
  const id = useId().replace(/:/g, '')
  const clipAll = `uj-a-${id}`
  const clipDiag = `uj-b-${id}`
  return (
    <svg viewBox="0 0 60 30" className={className} role="img" aria-hidden="true">
      <clipPath id={clipAll}>
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <clipPath id={clipDiag}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <g clipPath={`url(#${clipAll})`}>
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path
          d="M0,0 L60,30 M60,0 L0,30"
          clipPath={`url(#${clipDiag})`}
          stroke="#C8102E"
          strokeWidth="4"
        />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  )
}
