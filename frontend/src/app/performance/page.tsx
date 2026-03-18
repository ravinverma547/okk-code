"use client"

import { useState, useEffect } from "react"
import { 
  Trophy, 
  Search, 
  Plus, 
  Activity, 
  GraduationCap, 
  TrendingUp,
  Loader2,
  Calendar,
  MoreHorizontal
} from "lucide-react"
import { performanceService, studentService } from "@/api/services"

import { useAuth } from "@/context/AuthContext"

export default function PerformancePage() {
  const { user } = useAuth()
  const [records, setRecords] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    student: "",
    subject: "",
    marks: 0,
    totalMarks: 100,
    type: "EXAM",
    remarks: ""
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      if (user?.role === 'STUDENT') {
        if (user.studentProfile) {
          const performanceData = await performanceService.getStudentPerformance(user.studentProfile)
          setRecords(performanceData)
        }
      } else {
        const [performanceData, studentsData] = await Promise.all([
          performanceService.getAllPerformance(),
          studentService.getStudents()
        ])
        setRecords(performanceData)
        setStudents(studentsData.students || studentsData)
      }
    } catch (err) {
      console.error("Failed to fetch data", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await performanceService.addPerformance(formData)
      setIsModalOpen(false)
      fetchData()
    } catch (err) {
      console.error("Failed to add performance", err)
    }
  }

  const filteredRecords = records.filter((r: any) => 
    r.student?.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.subject.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {user?.role === 'STUDENT' ? 'My Performance' : 'Student Performance'}
          </h1>
          <p className="text-slate-500">Track academic marks, quizzes, and activities</p>
        </div>
        {user?.role === 'ADMIN' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-all shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Result
          </button>
        )}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search student or subject..."
          className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full flex h-48 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        ) : filteredRecords.map((record: any) => (
          <div key={record._id} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                  record.type === 'EXAM' ? 'bg-indigo-50 text-indigo-600' : 
                  record.type === 'ACTIVITY' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {record.type === 'EXAM' ? <GraduationCap className="h-5 w-5" /> : 
                   record.type === 'ACTIVITY' ? <Activity className="h-5 w-5" /> : <Trophy className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{record.student?.user?.name}</h3>
                  <p className="text-xs text-slate-500">{record.subject}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-slate-900">{record.marks}/{record.totalMarks}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{record.type}</div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
              <div className="flex items-center text-xs text-slate-400">
                <Calendar className="mr-1.5 h-3.5 w-3.5" />
                {new Date(record.date).toLocaleDateString()}
              </div>
              <div className="text-xs font-semibold text-indigo-600">
                {Math.round((record.marks/record.totalMarks) * 100)}% Score
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Record New Performance</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Student</label>
                <select
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                  value={formData.student}
                  onChange={(e) => setFormData({ ...formData, student: e.target.value })}
                >
                  <option value="">Select a student...</option>
                  {students.map((s: any) => (
                    <option key={s._id} value={s._id}>{s.name || s.user?.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="EXAM">Exam</option>
                    <option value="ASSIGNMENT">Assignment</option>
                    <option value="QUIZ">Quiz</option>
                    <option value="ACTIVITY">Activity</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Marks Obtained</label>
                  <input
                    type="number"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                    value={formData.marks}
                    onChange={(e) => setFormData({ ...formData, marks: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Total Marks</label>
                  <input
                    type="number"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                    value={formData.totalMarks}
                    onChange={(e) => setFormData({ ...formData, totalMarks: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
                >
                  Save Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
