'use client'

import { Modal } from '@/components/ui/Modal'

interface Props {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  isDestructive?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', isDestructive, onConfirm, onCancel,
}: Props) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="text-sm text-salt-text-sec">{message}</p>
      <div className="flex justify-end gap-2 mt-5">
        <button
          type="button"
          onClick={onCancel}
          className="border border-[0.5px] border-salt-border rounded-lg px-4 py-2 text-sm text-salt-text"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`rounded-lg px-4 py-2 text-sm text-white transition-colors ${
            isDestructive ? 'bg-red-600 hover:bg-red-700' : 'bg-salt-navy hover:bg-salt-navy-hover'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
