export const INPUT_CLASSES =
  // text-base on mobile: anything under 16px makes iOS Safari zoom the viewport
  // on focus. Identical to the old text-sm from the sm breakpoint up.
  'w-full border border-[0.5px] border-salt-border rounded-lg px-3 py-2.5 text-base sm:text-sm focus:outline-none focus:border-salt-navy bg-white'

export const PRIMARY_BUTTON_CLASSES =
  'w-full bg-salt-navy hover:bg-salt-navy-hover transition-colors text-white rounded-lg py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed'

// In-card submit: full width on mobile for the touch target, sized to its
// label from sm up so it does not span a whole settings card.
export const CARD_ACTION_CLASSES =
  'w-full sm:w-auto sm:self-start bg-salt-navy hover:bg-salt-navy-hover transition-colors text-white rounded-lg px-5 py-2.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed'

export const SECONDARY_BUTTON_CLASSES =
  'w-full bg-white hover:bg-salt-cream transition-colors text-salt-text border border-[0.5px] border-salt-border rounded-lg py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed'
