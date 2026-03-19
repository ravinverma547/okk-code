"use client"

import { useState, useEffect } from "react"
import {
  ClipboardCheck,
  Search,
  Calendar as CalendarIcon,
  User,
  CheckCircle,
  XCircle,
  Loader2,
  Save,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { attendanceService, studentService } from "@/api/services"

export default function AttendancePage() {
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [attendance, setAttendance] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<'mark' | 'history'>('mark')
  const [history, setHistory] = useState<any[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<string>("")

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const responseData = await studentService.getStudents()

      // Yahan hum object me se sirf 'students' ka array nikal rahe hain
      const studentsArray = responseData.students || []

      setStudents(studentsArray)

      // Initialize attendance state
      const initialAttendance: Record<string, string> = {}
      studentsArray.forEach((s: any) => {
        initialAttendance[s._id] = 'PRESENT'
      })
      setAttendance(initialAttendance)
    } catch (err) {
      console.error("Failed to fetch students", err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }))
  }

  const handleSave = async () => {
    setSubmitting(true)
    try {
      // In a real app, we'd send a bulk update
      const promises = Object.entries(attendance).map(([studentId, status]) =>
        attendanceService.markAttendance({ studentId, date, status })
      )
      await Promise.all(promises)
      alert("Attendance saved successfully!")
    } catch (err) {
      console.error("Failed to save attendance", err)
      alert("Error saving attendance")
    } finally {
      setSubmitting(false)
    }
  }

  const filteredStudents = students.filter((s: any) =>
    (s.user?.name || s.userDetails?.name || s.userId?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  )

  const fetchHistory = async (studentId: string) => {
    if (!studentId) return
    setHistoryLoading(true)
    try {
      const data = await attendanceService.getHistory(studentId)
      setHistory(data)
    } catch (err) {
      console.error("Failed to fetch history", err)
    } finally {
      setHistoryLoading(false)
    }
  }

  useEffect(() => {
    if (viewMode === 'history' && selectedStudent) {
      fetchHistory(selectedStudent)
    }
  }, [viewMode, selectedStudent])

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Attendance Tracking</h1>
          <p className="text-slate-500">
            {viewMode === 'mark' ? 'Mark daily attendance for all students' : 'View past attendance records'}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setViewMode(viewMode === 'mark' ? 'history' : 'mark')}
            className="flex items-center justify-center rounded-lg bg-white border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            {viewMode === 'mark' ? 'View History' : 'Mark Attendance'}
          </button>
          {viewMode === 'mark' && (
            <button
              onClick={handleSave}
              disabled={submitting}
              className="flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-md active:scale-95"
            >
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Attendance
            </button>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm glass">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            {viewMode === 'mark' ? (
              <div className="flex items-center rounded-xl bg-slate-50 border border-slate-200 p-1">
                <button className="p-2 hover:bg-white rounded-lg transition-colors text-slate-600">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="px-4 flex items-center text-sm font-medium text-slate-700">
                  <CalendarIcon className="mr-2 h-4 w-4 text-indigo-500" />
                  {new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                <button className="p-2 hover:bg-white rounded-lg transition-colors text-slate-600">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-slate-500 uppercase">Select Student:</label>
                <select 
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2 text-sm outline-none focus:bg-white focus:border-indigo-500 transition-all font-medium"
                >
                  <option value="">Choose Student...</option>
                  {students.map(s => (
                    <option key={s._id} value={s._id}>{s.user?.name || s.userDetails?.name || s.userId?.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter students..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {viewMode === 'mark' ? (
          <div className="mt-8 overflow-hidden rounded-xl border border-slate-100">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Last 7 Days</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-10 text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-500" />
                    </td>
                  </tr>
                ) : filteredStudents.map((student: any) => (
                  <tr key={student._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-9 w-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold border border-indigo-200">
                          {(student.user?.name || student.userDetails?.name || student.userId?.name || "?").charAt(0)}
                        </div>
                        <div className="ml-3">
                          <div className="font-semibold text-slate-900">{student.user?.name || student.userDetails?.name || student.userId?.name}</div>
                          <div className="text-xs text-slate-500">{student.studentId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-3">
                        <button
                          onClick={() => handleStatusChange(student._id, 'PRESENT')}
                          className={`group flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-all ${attendance[student._id] === 'PRESENT'
                              ? 'bg-green-100 text-green-700 ring-2 ring-green-500/20 shadow-sm'
                              : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                            }`}
                        >
                          <CheckCircle className={`mr-1.5 h-4 w-4 ${attendance[student._id] === 'PRESENT' ? 'text-green-600' : 'text-slate-300'}`} />
                          Present
                        </button>
                        <button
                          onClick={() => handleStatusChange(student._id, 'ABSENT')}
                          className={`group flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-all ${attendance[student._id] === 'ABSENT'
                              ? 'bg-rose-100 text-rose-700 ring-2 ring-rose-500/20 shadow-sm'
                              : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                            }`}
                        >
                          <XCircle className={`mr-1.5 h-4 w-4 ${attendance[student._id] === 'ABSENT' ? 'text-rose-600' : 'text-slate-300'}`} />
                          Absent
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        {[1, 2, 3, 4, 5, 6, 7].map(i => (
                          <div key={i} className={`h-2 w-2 rounded-full ${i % 3 === 0 ? 'bg-rose-400' : 'bg-green-400'}`} />
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-xl border border-slate-100">
             <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {historyLoading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-10 text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-500" />
                    </td>
                  </tr>
                ) : history.length > 0 ? history.map((record: any) => (
                  <tr key={record._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-700">
                      {new Date(record.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        record.status === 'PRESENT' ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       {/* Future: allow editing history */}
                       <button className="text-indigo-600 hover:text-indigo-900 text-sm font-semibold">View Details</button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-20 text-center text-slate-500 italic font-medium">
                      {selectedStudent ? 'No records found for this student.' : 'Please select a student to view history.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
