"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  BarChart3, 
  Users, 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  Bell, 
  CreditCard,
  ClipboardList,
  GraduationCap,
  Activity,
  Settings,
  Library,
  LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Students", href: "/students", icon: Users, roles: ['ADMIN', 'TEACHER'] },
  { name: "Teachers", href: "/teachers", icon: Users, roles: ['ADMIN'], adminOnly: true }, // Admin manages teachers
  { name: "Attendance", href: "/attendance", icon: ClipboardList, roles: ['ADMIN', 'TEACHER'] },
  { name: "Fees", href: "/fees", icon: CreditCard, roles: ['ADMIN'] },
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: 'Study Material', href: '/study-material', icon: Library, roles: ['ADMIN', 'TEACHER', 'STUDENT'] },
  { name: 'Leave', href: '/leave', icon: Calendar, roles: ['ADMIN', 'TEACHER', 'STUDENT'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['ADMIN', 'STUDENT', 'TEACHER'] },
  { name: "Performance", href: "/performance", icon: Activity, roles: ['ADMIN', 'TEACHER', 'STUDENT'] },
  { name: "Admins", href: "/admins", icon: Users, roles: ['ADMIN'] },
  { name: "Notices", href: "/notices", icon: Bell },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <div className="flex h-full w-64 flex-col bg-slate-900 text-white">
      <div className="flex h-20 items-center px-6 border-b border-slate-800/50">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 ring-1 ring-indigo-500/20">
          <GraduationCap className="h-6 w-6 text-indigo-400" />
        </div>
        <span className="ml-3 text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">OKK Code</span>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.filter(item => !item.roles || (user?.role && item.roles.includes(user.role))).map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-indigo-600 text-white" 
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                isActive ? "text-white" : "text-slate-400 group-hover:text-white"
              )} />
              {item.name}
            </Link>
          )
        })}
      </nav>
      
      <div className="border-t border-slate-800 p-4 space-y-4">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{user?.name || 'Administrator'}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email || 'admin@example.com'}</p>
          </div>
        </div>
        
        <button 
          onClick={logout}
          className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  )
}
