'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell } from 'lucide-react'
import { NotificationDropdown } from '@/components/staff/NotificationDropdown'
import { useBellNotifications } from '@/lib/hooks/useBellNotifications'

export function NotificationBell() {
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const {
    notifications, unreadCount, isConnected, permission, requestPermission, markAllRead,
  } = useBellNotifications()

  useEffect(() => {
    if (!isOpen) return
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [isOpen])

  const handleToggle = () => {
    setIsOpen((prev) => !prev)
    if (!isOpen) markAllRead()
  }

  const handleSelect = (id: string) => {
    setIsOpen(false)
    router.push(`/staff/requests/${id}`)
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={handleToggle}
        aria-label="Notifications"
        className="relative w-9 h-9 flex items-center justify-center rounded-full bg-salt-cream text-salt-text-sec hover:text-salt-text transition-colors"
      >
        <Bell className="w-5 h-5" />
        <span
          className={`absolute bottom-1 right-1.5 w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-salt-green' : 'bg-salt-text-muted'}`}
        />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationDropdown
          notifications={notifications}
          showPermissionRow={permission === 'default'}
          onRequestPermission={requestPermission}
          onSelect={handleSelect}
        />
      )}
    </div>
  )
}
