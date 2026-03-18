"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { dashboardService } from "@/api/services"
import { useAuth } from "@/context/AuthContext"
import { 
  Users, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  Loader2,
  Trophy
} from "lucide-react"

export default function Home() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated && !localStorage.getItem('token')) {
      router.push("/login")
      return
    }

    const fetchStats = async () => {
      if (user?.role === 'STUDENT') {
        setLoading(false)
        return
      }
      try {
        const data = await dashboardService.getStats()
        setStats(data)
      } catch (err) {
        console.error("Failed to fetch stats", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [isAuthenticated, router])

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  const statCards = [
    { 
      name: "Total Students", 
      value: stats?.totalStudents || 0, 
      change: "+12.5%", 
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    { 
      name: "Monthly Revenue", 
      value: `₹${stats?.monthlyRevenue || 0}`, 
      change: "Stable", 
      trend: "up",
      icon: TrendingUp,
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    { 
      name: "Pending Fees", 
      value: stats?.pendingFees || 0, 
      change: "Check details", 
      trend: "down",
      icon: AlertCircle,
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
    { 
      name: "At-Risk Students", 
      value: stats?.atRiskStudentsCount || 0, 
      change: "-2 from last week", 
      trend: "down",
      icon: CheckCircle2,
      color: "text-rose-600",
      bg: "bg-rose-50"
    },
  ]

  if (user?.role === 'STUDENT') {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Welcome back, {user?.name}! Here's your academic overview.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 text-center flex flex-col items-center justify-center">
             <div className="mb-4 rounded-full bg-indigo-50 p-4">
                <BookOpen className="h-8 w-8 text-indigo-600" />
             </div>
             <h3 className="text-lg font-bold text-slate-900">My Courses</h3>
             <p className="mt-2 text-sm text-slate-500">View your enrolled courses and materials.</p>
             <button onClick={() => router.push('/courses')} className="mt-6 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">View Courses</button>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 text-center flex flex-col items-center justify-center">
             <div className="mb-4 rounded-full bg-emerald-50 p-4">
                <Trophy className="h-8 w-8 text-emerald-600" />
             </div>
             <h3 className="text-lg font-bold text-slate-900">My Performance</h3>
             <p className="mt-2 text-sm text-slate-500">Check your latest marks and activities.</p>
             <button onClick={() => router.push('/performance')} className="mt-6 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500">View Performance</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-slate-500">Welcome back, {user?.name || 'Admin'}! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.name} className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className={stat.bg + " p-2 rounded-lg"}>
                <stat.icon className={"h-6 w-6 " + stat.color} />
              </div>
              <div className={"flex items-center text-xs font-medium " + (stat.trend === "up" ? "text-emerald-600" : "text-rose-600")}>
                {stat.change}
                {stat.trend === "up" ? <ArrowUpRight className="ml-1 h-3 w-3" /> : <ArrowDownRight className="ml-1 h-3 w-3" />}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">{stat.name}</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* At-Risk Students Card */}
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h3 className="text-lg font-semibold text-slate-900">At-Risk Students</h3>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">View All</button>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-4">
              {stats?.atRiskStudents?.length > 0 ? (
                stats.atRiskStudents.map((student: any) => (
                  <div key={student._id} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0">
                    <div className="flex gap-3">
                      <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 font-bold">
                        {student.userId?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{student.userId?.name}</p>
                        <p className="text-xs text-slate-500">{student.course || 'No Course'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-rose-600">{student.attendancePercentage}% Attendance</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-4 text-sm text-slate-500">No students at risk currently.</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 p-6">
            <button onClick={() => router.push('/students')} className="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-6 text-slate-600 transition-all hover:bg-slate-100 hover:text-indigo-600 hover:border-indigo-200 group">
              <Users className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Manage Students</span>
            </button>
            <button onClick={() => router.push('/attendance')} className="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-6 text-slate-600 transition-all hover:bg-slate-100 hover:text-indigo-600 hover:border-indigo-200 group">
              <CheckCircle2 className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Mark Attendance</span>
            </button>
            <button onClick={() => router.push('/fees')} className="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-6 text-slate-600 transition-all hover:bg-slate-100 hover:text-indigo-600 hover:border-indigo-200 group">
              <TrendingUp className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Fee Payments</span>
            </button>
            <button onClick={() => router.push('/courses')} className="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-6 text-slate-600 transition-all hover:bg-slate-100 hover:text-indigo-600 hover:border-indigo-200 group">
              <BookOpen className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Course Manager</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
