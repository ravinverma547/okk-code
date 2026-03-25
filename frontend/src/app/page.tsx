"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { dashboardService, studentService } from "@/api/services"
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
  Trophy,
  Megaphone,
  DollarSign,
  Library
} from "lucide-react"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from "recharts"

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e'];

export default function Home() {
  const { isAuthenticated, user } = useAuth()
// ... (rest of the state and useEffect remains mostly same, just updating UI)
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated && !localStorage.getItem('token')) {
      router.push("/login")
      return
    }

    const fetchStats = async () => {
      if (!user) return;

      if (user.role === 'STUDENT') {
        try {
          const { feeService } = await import("@/api/services")
          const studentId = user.studentProfile?._id || user.studentProfile;
          if (studentId) {
            // Fetch live profile to get updated courses
            const profile = await studentService.getStudentById(studentId);
            const studentFees = await feeService.getStudentFees(studentId);
            
            let total = 0, paid = 0;
            const feesArray = Array.isArray(studentFees) ? studentFees : [studentFees];
            feesArray.forEach((f: any) => {
               total += (f.totalAmount || f.amount || 0);
               paid += (f.paidAmount || 0);
            });
            setStats({ 
              studentFees: { total, paid, remaining: total - paid },
              courseCount: profile.courses?.length || 0
            })
          }
        } catch (err) {
          console.error("Failed to fetch student dashboard data", err)
        } finally {
          setLoading(false)
        }
        return
      }

      if (user.role === 'TEACHER') {
        try {
          const { teacherService } = await import("@/api/services")
          const profile = await teacherService.getTeacherProfile()
          setStats({
            courseCount: profile.assignedCourses?.length || 0,
            studentCount: profile.studentCount || 0, // Backend should return this or we calculate
            experience: profile.experience,
            subjects: profile.subjects
          })
        } catch (err) {
          console.error("Failed to fetch teacher dashboard data", err)
        } finally {
          setLoading(false)
        }
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
  }, [isAuthenticated, router, user])

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

  if (user?.role === 'TEACHER') {
    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">Welcome, {user?.name}!</h1>
            <p className="text-slate-500">Teacher Dashboard • {stats?.qualification || 'Faculty Member'}</p>
          </div>
          <div className="px-4 py-2 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center gap-3">
             <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
             <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Role: Teacher</span>
          </div>
        </div>

        {/* Teacher Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 glass transition-all hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Assigned Courses</p>
                <p className="text-2xl font-bold text-slate-900">{stats?.courseCount || 0}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 glass transition-all hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Students</p>
                <p className="text-2xl font-bold text-slate-900">{stats?.studentCount || 0}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 glass transition-all hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Years Experience</p>
                <p className="text-2xl font-bold text-slate-900">{stats?.experience || 0} Years</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions for Teachers */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
           <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
             <h3 className="text-lg font-bold text-slate-900 mb-4">My Quick Actions</h3>
             <div className="grid grid-cols-2 gap-4">
               <button onClick={() => router.push('/attendance')} className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-100 group transition-all">
                 <CheckCircle2 className="h-6 w-6 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
                 <span className="text-sm font-medium text-slate-700">Attendance</span>
               </button>
               <button onClick={() => router.push('/performance')} className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-100 group transition-all">
                 <TrendingUp className="h-6 w-6 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                 <span className="text-sm font-medium text-slate-700">Performance</span>
               </button>
               <button onClick={() => router.push('/courses')} className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-amber-50 hover:border-amber-100 group transition-all">
                 <BookOpen className="h-6 w-6 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
                 <span className="text-sm font-medium text-slate-700">Courses</span>
               </button>
               <button onClick={() => router.push('/notices')} className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-rose-50 hover:border-rose-100 group transition-all">
                 <Megaphone className="h-6 w-6 text-rose-600 mb-2 group-hover:scale-110 transition-transform" />
                 <span className="text-sm font-medium text-slate-700">Notices</span>
               </button>
             </div>
           </div>

           <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-8 shadow-xl text-white relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold">Manage Your Classes</h3>
                <p className="mt-3 text-indigo-100 leading-relaxed">
                  Track student progress, mark attendance, and share important notices with your assigned batches effortlessly.
                </p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {stats?.subjects?.map((sub: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium border border-white/10">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
              <BookOpen className="absolute -right-10 -bottom-10 h-40 w-40 text-white/10 rotate-12 group-hover:scale-110 transition-transform" />
           </div>
        </div>
      </div>
    )
  }

  if (user?.role === 'STUDENT') {
    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
           <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">Hello, {user?.name}!</h1>
            <p className="text-slate-500">Welcome to your academic portal</p>
          </div>
          <div className="px-4 py-2 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center gap-3">
             <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Status: Active</span>
          </div>
        </div>

        {/* Student Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
           <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 glass transition-all hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Enrolled Courses</p>
                  <p className="text-2xl font-bold text-slate-900">{stats?.courseCount || 0}</p>
                </div>
              </div>
           </div>
           <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 glass transition-all hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Fees</p>
                  <p className="text-2xl font-bold text-slate-900">₹{stats?.studentFees?.total.toLocaleString() || 0}</p>
                </div>
              </div>
           </div>
           <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 glass transition-all hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-green-50 p-3 text-green-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Paid Amount</p>
                  <p className="text-2xl font-bold text-green-600">₹{stats?.studentFees?.paid.toLocaleString() || 0}</p>
                </div>
              </div>
           </div>
           <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 glass transition-all hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-rose-50 p-3 text-rose-600">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Remaining</p>
                  <p className="text-2xl font-bold text-rose-600">₹{stats?.studentFees?.remaining.toLocaleString() || 0}</p>
                </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 text-center flex flex-col items-center justify-center glass group hover:ring-indigo-300 transition-all">
             <div className="mb-4 rounded-full bg-indigo-50 p-6 group-hover:bg-indigo-100 transition-colors">
                <BookOpen className="h-10 w-10 text-indigo-600 group-hover:scale-110 transition-transform" />
             </div>
             <h3 className="text-xl font-bold text-slate-900">
               {stats?.courseCount > 0 ? 'My Courses' : 'Join a Course'}
             </h3>
             <p className="mt-2 text-sm text-slate-500 max-w-[250px]">
               {stats?.courseCount > 0 
                ? 'Check your active batch, syllabus, and class updates.'
                : 'You are not enrolled in any course yet. Explore our top courses now!'}
             </p>
             <button onClick={() => router.push('/courses')} className="mt-8 w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-500 shadow-xl shadow-indigo-200 active:scale-95 transition-all">
                {stats?.courseCount > 0 ? 'Go to Courses' : 'Find Your Path'}
             </button>
          </div>

          <div className="rounded-2xl bg-emerald-600 p-8 shadow-sm text-center flex flex-col items-center justify-center text-white glass-dark group transition-all">
             <div className="mb-4 rounded-full bg-white/20 p-6 group-hover:bg-white/30 transition-colors">
                <Trophy className="h-10 w-10 text-white" />
             </div>
             <h3 className="text-xl font-bold">My Performance</h3>
             <p className="mt-2 text-white/80 text-sm max-w-[250px]">Review your grades, attendance records and teacher feedback.</p>
             <button onClick={() => router.push('/performance')} className="mt-8 w-full rounded-xl bg-white py-3 text-sm font-bold text-emerald-600 hover:bg-slate-100 shadow-xl active:scale-95 transition-all outline-none ring-offset-2 focus:ring-2 focus:ring-white">
               View My Progress
             </button>
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
          <div key={stat.name} className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md glass group cursor-pointer">
            <div className="flex items-center justify-between">
              <div className={stat.bg + " p-2 rounded-lg group-hover:scale-110 transition-transform"}>
                <stat.icon className={"h-6 w-6 " + stat.color} />
              </div>
              <div className={"flex items-center text-xs font-bold " + (stat.trend === "up" ? "text-emerald-600" : "text-rose-600")}>
                {stat.change}
                {stat.trend === "up" ? <ArrowUpRight className="ml-1 h-3 w-3" /> : <ArrowDownRight className="ml-1 h-3 w-3" />}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.name}</p>
              <p className="mt-1 text-3xl font-extrabold text-slate-900">{stat.value}</p>
            </div>
            <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500 ${stat.bg.replace('bg-', 'bg-')}`} style={{backgroundColor: 'currentColor'}} />
          </div>
        ))}
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Revenue Trend Area Chart */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 glass">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Revenue Growth</h3>
              <p className="text-xs text-slate-500 font-medium">Monthly collection overview</p>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
               <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.revenueTrend || []}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance Distribution */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 glass">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Attendance Status</h3>
              <p className="text-xs text-slate-500 font-medium">Weekly daily avg</p>
            </div>
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
               <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.attendanceTrend || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} hide />
                <Tooltip 
                  cursor={{fill: '#f8fafc', radius: 8}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="attendance" fill="#818cf8" radius={[6, 6, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
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
                        {(student.user?.name || student.userId?.name || "?").charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{student.user?.name || student.userId?.name}</p>
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
            <button onClick={() => router.push('/notices')} className="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-6 text-slate-600 transition-all hover:bg-slate-100 hover:text-indigo-600 hover:border-indigo-200 group col-span-2 sm:col-span-1">
              <Megaphone className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform text-amber-500" />
              <span className="text-sm font-medium">Notice Board</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
