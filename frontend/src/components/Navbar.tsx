"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Bell, User, Menu, X, CheckCircle2, AlertCircle, Info } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { io, Socket } from "socket.io-client"
import { toast } from "sonner"

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'notice' | 'fee' | 'system';
  time: Date;
  read: boolean;
}

export default function Navbar() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000'

  useEffect(() => {
    if (!user) return

    // Initialize socket
    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      upgrade: false
    })
    socketRef.current = socket

    socket.on('connect', () => {
      console.log('Socket connected')
      // Join a room based on user role or ID if the backend supports it
      if (user.role) {
        socket.emit('join_room', user.role)
      }
    })

    // Listen for new notices
    socket.on('new_notice', (data: any) => {
      const newNotif: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        title: 'New Notice',
        message: data.title || 'A new notice has been posted',
        type: 'notice',
        time: new Date(),
        read: false
      }
      setNotifications(prev => [newNotif, ...prev])
      setHasUnread(true)
      toast.info('New Notice: ' + newNotif.message)
    })

    // Listen for fee updates
    socket.on('fee_due', (data: any) => {
      const newNotif: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        title: 'Fee Payment Due',
        message: `Your fee payment is due for ${data.month || 'this month'}`,
        type: 'fee',
        time: new Date(),
        read: false
      }
      setNotifications(prev => [newNotif, ...prev])
      setHasUnread(true)
      toast.error('Payment Reminder: ' + newNotif.message)
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [user])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setHasUnread(false)
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'notice': return <Info className="h-4 w-4 text-blue-500" />
      case 'fee': return <AlertCircle className="h-4 w-4 text-rose-500" />
      default: return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
    }
  }

  return (
    <header className="flex h-16 w-full items-center justify-between border-b bg-white px-6 sticky top-0 z-30">
      <div className="flex w-full max-w-xl items-center">
        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search students, courses..."
            className="block w-full rounded-xl border-0 bg-slate-50 py-2 pl-10 pr-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-600 outline-none transition-all duration-200"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Notifications Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => {
              setShowDropdown(!showDropdown)
              if (!showDropdown && hasUnread) markAllRead()
            }}
            className="relative rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
          >
            <Bell className="h-5 w-5" />
            {hasUnread && (
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-rose-500 animate-pulse"></span>
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-slate-200 animate-in fade-in slide-in-from-top-3 duration-200">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-50">
                <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  Recent
                </span>
              </div>
              
              <div className="max-h-96 overflow-y-auto py-2">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400 mb-3">
                      <Bell className="h-6 w-6" />
                    </div>
                    <p className="text-sm text-slate-500">No new notifications</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`group relative flex gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer ${!n.read ? 'bg-indigo-50/30' : ''}`}
                    >
                      <div className="mt-1 shrink-0">
                        {getIcon(n.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm ${!n.read ? 'font-bold text-slate-900' : 'text-slate-700'}`}>{n.title}</p>
                          <span className="text-[10px] text-slate-400">{n.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{n.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="px-2 py-2 border-t border-slate-50">
                <button 
                  onClick={() => setShowDropdown(false)}
                  className="w-full text-center py-2 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors rounded-lg hover:bg-slate-50"
                >
                  Close Panel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-slate-200"></div>
        
        <button className="flex items-center space-x-2 rounded-xl p-1 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm ring-2 ring-white">
            <User className="h-5 w-5" />
          </div>
          <div className="hidden flex-col items-start md:flex">
            <span className="text-xs font-bold text-slate-900">{user?.name || "User"}</span>
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">{user?.role || "Guest"}</span>
          </div>
        </button>
      </div>
    </header>
  )
}
