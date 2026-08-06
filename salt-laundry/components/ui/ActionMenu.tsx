'use client'

import { MoreVertical, type LucideIcon } from 'lucide-react'
import { useAnchoredMenu } from '@/lib/hooks/useAnchoredMenu'

export interface ActionMenuItem {
  label: string
  icon: LucideIcon
  onSelect: () => void
  toneClass?: string
}

interface Props {
  label: string           // what the trigger does, for screen readers
  items: ActionMenuItem[]
  hoverClass?: string     // trigger hover, tinted against whatever sits behind it
}

// One trigger per row instead of a line of buttons: the actions stay readable
// as more of them are added, and the row keeps a single click target.
export function ActionMenu({ label, items, hoverClass = 'hover:bg-salt-cream' }: Props) {
  const { anchor, isOpen, containerRef, triggerRef, close, toggle } = useAnchoredMenu()

  return (
    <div className="relative" ref={containerRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className={`w-8 h-8 inline-flex items-center justify-center rounded-md transition-colors
          ${hoverClass} ${isOpen ? 'text-salt-navy bg-salt-cream' : 'text-salt-text-sec hover:text-salt-navy'}`}
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {anchor && (
        <div
          role="menu"
          style={{ top: anchor.top, right: anchor.right }}
          className="fixed w-48 bg-white border border-[0.5px] border-salt-border rounded-lg shadow-sm py-1.5 flex flex-col z-50"
        >
          {items.map(({ label: itemLabel, icon: Icon, onSelect, toneClass }) => (
            <button
              key={itemLabel}
              type="button"
              role="menuitem"
              onClick={() => {
                close()
                onSelect()
              }}
              className={`flex items-center gap-2.5 px-3 py-2 text-sm text-left whitespace-nowrap
                hover:bg-salt-cream transition-colors ${toneClass ?? 'text-salt-text-sec'}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {itemLabel}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
