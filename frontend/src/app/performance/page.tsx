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
  MoreHorizontal,
  Download
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

  const [selectedPerformance, setSelectedPerformance] = useState<any>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

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

  const handleExportCSV = () => {
    const headers = ["Student,Subject,Type,Date,Marks,Total"]
    const rows = records.map(r => 
      `${r.student?.user?.name},${r.subject},${r.type},${new Date(r.date).toLocaleDateString()},${r.marks},${r.totalMarks}`
    )
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `performance_export_${new Date().toLocaleDateString()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
          <p className="text-slate-500">Track academic marks, quizzes, and activities in a professional view.</p>
        </div>
        <div className="flex gap-2">
           <button 
            onClick={handleExportCSV}
            className="flex items-center justify-center rounded-lg bg-white border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </button>
          {user?.role === 'ADMIN' && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-all shadow-sm active:scale-95"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Result
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search student or subject..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-center">Marks</th>
                <th className="px-6 py-4 text-center">Percentage</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-500" />
                  </td>
                </tr>
              ) : filteredRecords.length > 0 ? filteredRecords.map((record: any) => (
                <tr key={record._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">{record.student?.user?.name || 'Unknown Student'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{record.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      record.type === 'EXAM' ? 'bg-indigo-100 text-indigo-700' : 
                      record.type === 'ACTIVITY' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {record.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-xs font-medium">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="font-bold text-slate-900">{record.marks}</span>
                    <span className="text-slate-400">/{record.totalMarks}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex flex-col items-center">
                      <span className={`text-xs font-bold ${
                        (record.marks/record.totalMarks) >= 0.75 ? 'text-emerald-600' :
                        (record.marks/record.totalMarks) >= 0.40 ? 'text-indigo-600' : 'text-rose-600'
                      }`}>
                        {Math.round((record.marks/record.totalMarks) * 100)}%
                      </span>
                      <div className="w-12 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div 
                          className={`h-full ${
                             (record.marks/record.totalMarks) >= 0.75 ? 'bg-emerald-500' :
                             (record.marks/record.totalMarks) >= 0.40 ? 'bg-indigo-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${(record.marks/record.totalMarks) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button 
                      onClick={() => {
                        setSelectedPerformance(record)
                        setIsViewModalOpen(true)
                      }}
                      className="text-indigo-600 hover:text-indigo-900 text-xs font-bold uppercase tracking-tight"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 italic">No performance records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

       {/* View Details Modal */}
       {isViewModalOpen && selectedPerformance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Performance Details</h2>
                <p className="text-slate-500">{selectedPerformance.student?.user?.name}</p>
              </div>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <MoreHorizontal className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Subject</p>
                  <p className="font-bold text-slate-900">{selectedPerformance.subject}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Record Type</p>
                  <p className="font-bold text-slate-900">{selectedPerformance.type}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-6 rounded-2xl bg-indigo-50 border-2 border-indigo-100">
                <div>
                   <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Total Outcome</p>
                   <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-4xl font-black text-indigo-700">{selectedPerformance.marks}</span>
                      <span className="text-xl font-bold text-indigo-300">/ {selectedPerformance.totalMarks}</span>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Percentage</p>
                   <p className="text-3xl font-black text-indigo-700 mt-1">{Math.round((selectedPerformance.marks/selectedPerformance.totalMarks) * 100)}%</p>
                </div>
              </div>

              <div className="py-2">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Teacher Remarks</p>
                 <p className="text-slate-700 text-sm leading-relaxed bg-amber-50/50 p-4 rounded-xl border border-amber-100 italic">
                    "{selectedPerformance.remarks || 'No specific remarks provided for this record.'}"
                 </p>
              </div>

              <button
                onClick={() => setIsViewModalOpen(false)}
                className="w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white hover:bg-slate-800 transition-all"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

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
