"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { ChevronDown } from "lucide-react";
import { useClickOutside } from "@/lib/hooks/useClickOutside";
import { ALLOWED_ROOMS } from "@/lib/constants/rooms";
import { INPUT_CLASSES } from "@/lib/constants/formStyles";

interface Props {
  value: string;
  onChange: (value: string) => void;
  // Lets a react-hook-form field mark itself touched on blur.
  onBlur?: () => void;
  // Runs for keys the combobox doesn't consume itself- e.g. Enter while the list
  // is closed- so a caller can wire "Enter submits" without stealing the
  // Enter-picks-a-room behaviour that applies while the list is open.
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  // Base id for the input; the listbox and its options derive their ids from it,
  // so two instances on one page never collide.
  id?: string;
  placeholder?: string;
  autoFocus?: boolean;
  maxLength?: number;
  invalid?: boolean;
  // Shows the value but blocks editing- e.g. a room that arrived pre-filled
  // from a scanned link. The dropdown never opens while disabled.
  disabled?: boolean;
  // Turns the field into a plain numeric text box: no room-list dropdown, no
  // chevron, no combobox keyboard nav. Everything else- the numeric keypad,
  // maxLength, invalid styling, the onKeyDown passthrough- behaves the same.
  hideDropdown?: boolean;
}

// The one room-number field used everywhere a room is asked for- the request
// form, the QR generator, and the track page. The room list is fixed and short,
// so the person picks rather than types, but the field stays a real text input
// so someone who knows their number can type it and watch the list narrow. Same
// listbox idiom as ItemSearch: focus never leaves the input, the arrows move a
// highlight instead. Controlled (value/onChange) so any caller- react-hook-form
// or plain useState- can own the value.
export function RoomNumberInput({
  value,
  onChange,
  onBlur,
  id = "roomNumber",
  placeholder = "e.g. 131",
  autoFocus,
  maxLength,
  invalid,
  hideDropdown,
  disabled,
  onKeyDown: onKeyDownProp,
}: Props) {
  const showDropdown = !hideDropdown;
  const listboxId = `${id}-options`;
  const optionId = (room: string) => `${id}-option-${room}`;

  const [isOpen, setIsOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside(containerRef, isOpen, () => setIsOpen(false));

  const query = value.trim();
  const matches = query
    ? ALLOWED_ROOMS.filter((room) => room.startsWith(query))
    : ALLOWED_ROOMS;

  const open = () => {
    setIsOpen(true);
    setHighlight(0);
  };

  const pick = (room: string) => {
    onChange(room);
    setIsOpen(false);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (showDropdown) {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }
      if (event.key === "ArrowDown" && !isOpen) {
        open();
        return;
      }
      if (isOpen && matches.length > 0) {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          setHighlight((index) => Math.min(index + 1, matches.length - 1));
        }
        if (event.key === "ArrowUp") {
          event.preventDefault();
          setHighlight((index) => Math.max(index - 1, 0));
        }
        if (event.key === "Enter") {
          // Enter here means "choose this room", not "submit the form".
          event.preventDefault();
          pick(matches[highlight]);
        }
      }
    }

    // Hand the event on only when we didn't consume it- so a caller's
    // "Enter submits" fires when the list is closed, never while it's open.
    if (!event.defaultPrevented) onKeyDownProp?.(event);
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        id={id}
        autoFocus={autoFocus}
        maxLength={maxLength}
        disabled={disabled}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          if (showDropdown) open();
        }}
        onFocus={showDropdown ? open : undefined}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder={placeholder}
        role={showDropdown ? "combobox" : undefined}
        aria-expanded={showDropdown ? isOpen : undefined}
        aria-controls={showDropdown ? listboxId : undefined}
        aria-autocomplete={showDropdown ? "list" : undefined}
        aria-invalid={invalid || undefined}
        // Focus stays in the input, so the highlight is announced from here.
        aria-activedescendant={
          showDropdown && isOpen && matches.length > 0
            ? optionId(matches[highlight])
            : undefined
        }
        className={`${INPUT_CLASSES} ${showDropdown ? "pr-9" : ""} disabled:cursor-not-allowed disabled:bg-salt-cream disabled:text-salt-text-sec`}
      />
      {showDropdown && !disabled && (
        <button
          type="button"
          tabIndex={-1}
          aria-label={isOpen ? "Hide room list" : "Show room list"}
          onClick={() => (isOpen ? setIsOpen(false) : open())}
          className="absolute right-0 top-0 h-[42px] px-3 flex items-center"
        >
          <ChevronDown
            className={`w-4 h-4 text-salt-text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      )}

      {showDropdown && isOpen && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute z-30 inset-x-0 top-full mt-1 max-h-56 overflow-y-auto bg-white border border-[0.5px] border-salt-border rounded-lg shadow-sm py-1"
        >
          {matches.length === 0 ? (
            <p className="px-3 py-2 text-sm text-salt-text-muted">
              No room matches “{query}”.
            </p>
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
                  event.preventDefault();
                  pick(room);
                }}
                className={`w-full text-left px-3 py-2 text-sm text-salt-text ${
                  index === highlight ? "bg-salt-cream" : ""
                }`}
              >
                {room}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
