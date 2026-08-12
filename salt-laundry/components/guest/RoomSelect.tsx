'use client'

import { useRef, useState, type KeyboardEvent } from 'react'
import { useFormContext } from 'react-hook-form'
import { ChevronDown } from 'lucide-react'
import { useClickOutside } from '@/lib/hooks/useClickOutside'
import { ALLOWED_ROOMS } from '@/lib/constants/rooms'
import { INPUT_CLASSES } from '@/lib/constants/formStyles'
import type { GuestDetailsValues } from '@/lib/validations/guestRequest.schema'

const LISTBOX_ID = 'room-options'
const optionId = (room: string) => `room-option-${room}`

// The room list is fixed and short, so the guest picks rather than types — but
// the field stays a real text input so someone who knows their number can type
// it and have the list narrow to it. Same listbox idiom as ItemSearch: focus
// never leaves the input, the arrows move a highlight instead.
export function RoomSelect() {
  const { register, setValue, watch } = useFormContext<GuestDetailsValues>()
  const value = watch('roomNumber') ?? ''

  const [isOpen, setIsOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  useClickOutside(containerRef, isOpen, () => setIsOpen(false))

  const query = value.trim()
  const matches = query ? ALLOWED_ROOMS.filter((room) => room.startsWith(query)) : ALLOWED_ROOMS

  const open = () => {
    setIsOpen(true)
    setHighlight(0)
  }

  const pick = (room: string) => {
    setValue('roomNumber', room, { shouldValidate: true, shouldDirty: true })
    setIsOpen(false)
  }

  const field = register('roomNumber')

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') return setIsOpen(false)
    if (event.key === 'ArrowDown' && !isOpen) return open()
    if (!isOpen || matches.length === 0) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlight((index) => Math.min(index + 1, matches.length - 1))
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlight((index) => Math.max(index - 1, 0))
    }
    if (event.key === 'Enter') {
      // Enter here means "choose this room", not "submit the order".
      event.preventDefault()
      pick(matches[highlight])
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        {...field}
        onChange={(event) => {
          field.onChange(event)
          open()
        }}
        onFocus={open}
        onKeyDown={onKeyDown}
        id="roomNumber"
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder="e.g. 131"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={LISTBOX_ID}
        aria-autocomplete="list"
        // Focus stays in the input, so the highlight is announced from here.
        aria-activedescendant={isOpen ? optionId(matches[highlight]) : undefined}
        className={`${INPUT_CLASSES} pr-9`}
      />
      <button
        type="button"
        tabIndex={-1}
        aria-label={isOpen ? 'Hide room list' : 'Show room list'}
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        className="absolute right-0 top-0 h-[42px] px-3 flex items-center"
      >
        <ChevronDown
          className={`w-4 h-4 text-salt-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          id={LISTBOX_ID}
          role="listbox"
          className="absolute z-30 inset-x-0 top-full mt-1 max-h-56 overflow-y-auto bg-white border border-[0.5px] border-salt-border rounded-lg shadow-sm py-1"
        >
          {matches.length === 0 ? (
            <p className="px-3 py-2 text-sm text-salt-text-muted">No room matches “{query}”.</p>
          ) : (
            matches.map((room, index) => (
              <button
                key={room}
                id={optionId(room)}
                type="button"
                role="option"
                aria-selected={room === query}
                onMouseEnter={() => setHighlight(index)}
                // mousedown, not click: the input's blur must not close the list first.
                onMouseDown={(event) => {
                  event.preventDefault()
                  pick(room)
                }}
                className={`w-full text-left px-3 py-2 text-sm text-salt-text ${
                  index === highlight ? 'bg-salt-cream' : ''
                }`}
              >
                {room}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
