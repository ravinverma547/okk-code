"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { studentService } from "@/api/services"
import { useAuth } from "@/context/AuthContext"
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal,
  Mail,
  Phone,
  GraduationCap,
  Loader2,
  X,
  Shield,
  Edit,
  Activity,
  Download
} from "lucide-react"

export default function StudentsPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [courseFilter, setCourseFilter] = useState("")
  const [courses, setCourses] = useState<any[]>([])
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "password123", // Default for demo
    role: "STUDENT",
    course: "",
    phone: "",
    address: ""
  })

  const [selectedStudentForView, setSelectedStudentForView] = useState<any>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const data = await studentService.getStudents({ 
        search, 
        status: statusFilter, 
        course: courseFilter 
      })
      setStudents(data.students || [])
    } catch (err) {
      console.error("Failed to fetch students", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCourses = async () => {
    try {
      const { courseService } = await import("@/api/services")
      const data = await courseService.getCourses()
      setCourses(data || [])
    } catch (err) {
      console.error("Failed to fetch courses", err)
    }
  }

  useEffect(() => {
    if (!isAuthenticated && !localStorage.getItem('token')) {
      router.push("/login")
      return
    }
    fetchStudents()
    fetchCourses()
  }, [isAuthenticated, router, search, statusFilter, courseFilter])

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await studentService.registerStudent(formData)
      setShowModal(false)
      fetchStudents()
      setFormData({ name: "", email: "", password: "password123", role: "STUDENT", course: "", phone: "", address: "" })
    } catch (err) {
      alert("Failed to register student. Check console for details.")
    }
  }

  const handleExportCSV = () => {
    const headers = ["Student ID,Name,Email,Phone,Status,Role"]
    const rows = students.map(s => 
      `${s.studentId},${s.user?.name},${s.user?.email},${s.phone || 'N/A'},${s.status},${s.user?.role}`
    )
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `students_export_${new Date().toLocaleDateString()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Management</h1>
          <p className="text-slate-500">Manage student records, enrollment, and profiles</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExportCSV}
            className="flex items-center justify-center rounded-lg bg-white border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-all shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border-0 bg-slate-50 py-2.5 pl-10 pr-4 text-sm ring-1 ring-inset ring-slate-200 outline-none focus:ring-2 focus:ring-indigo-600 transition-all" 
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border-0 bg-slate-50 py-2.5 pl-4 pr-10 text-sm ring-1 ring-inset ring-slate-200 outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium text-slate-600"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="AT_RISK">At Risk</option>
            </select>

            <select 
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="rounded-xl border-0 bg-slate-50 py-2.5 pl-4 pr-10 text-sm ring-1 ring-inset ring-slate-200 outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium text-slate-600"
            >
              <option value="">All Courses</option>
              {courses.map(course => (
                <option key={course._id} value={course._id}>{course.title}</option>
              ))}
            </select>
            
            {(statusFilter || courseFilter || search) && (
              <button 
                onClick={() => {
                  setStatusFilter("")
                  setCourseFilter("")
                  setSearch("")
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex h-[400px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="border-b border-slate-100 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Student</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Contact</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Course</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Performance</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.length > 0 ? students.map((student: any) => (
                  <tr key={student._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                          {(student.user?.name || student.userDetails?.name || student.userId?.name || '?').charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{student.user?.name || student.userDetails?.name || student.userId?.name}</div>
                          <div className="text-xs text-slate-500">ID: {student.studentId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-sm text-slate-500">
                        <div className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {student.user?.email || student.userDetails?.email || student.userId?.email}</div>
                        <div className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {student.phone || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                          <div className="flex flex-wrap gap-1 mt-1">
                            {student.courses && student.courses.length > 0 ? (
                              student.courses.map((course: any) => (
                                <span key={course._id} className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] text-indigo-700 font-bold border border-indigo-100 flex items-center gap-1">
                                  <GraduationCap className="h-3 w-3" />
                                  {course.title}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-400 text-xs italic">Unassigned</span>
                            )}
                          </div>
                        <div className={`w-fit rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          student.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 
                          student.status === 'INACTIVE' ? 'bg-slate-100 text-slate-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {student.status}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500" 
                            style={{ width: `${student.performanceScore || 0}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-slate-600">{student.performanceScore || 0}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <button 
                        onClick={() => setOpenDropdownId(openDropdownId === student._id ? null : student._id)}
                        className="text-slate-400 hover:text-slate-600 focus:outline-none"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>

                      {openDropdownId === student._id && (
                        <div className="absolute right-6 top-10 z-10 w-48 rounded-xl bg-white py-1 shadow-xl ring-1 ring-black/5 animate-in slide-in-from-top-1 duration-200">
                          <button
                            onClick={() => {
                              setSelectedStudentForView(student)
                              setIsViewModalOpen(true)
                              setOpenDropdownId(null)
                            }}
                            className="flex w-full items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <Search className="mr-2 h-4 w-4 text-indigo-500" />
                            View Details
                          </button>
                          <button
                            onClick={() => {
                              // Handle edit logic here if needed
                              setOpenDropdownId(null)
                            }}
                            className="flex w-full items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <Edit className="mr-2 h-4 w-4 text-amber-500" />
                            Edit Student
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">
                      No students found in the database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Register Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="text-lg font-semibold text-slate-900">Register New Student</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateStudent} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-500 uppercase">Full Name</label>
                  <input 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-500 uppercase">Email</label>
                  <input 
                    required 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-500 uppercase">Course</label>
                  <input 
                    value={formData.course}
                    onChange={(e) => setFormData({...formData, course: e.target.value})}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-500 uppercase">Phone</label>
                  <input 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                >
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {isViewModalOpen && selectedStudentForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="relative h-32 bg-indigo-600 overflow-hidden">
               <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
               <button 
                onClick={() => setIsViewModalOpen(false)} 
                className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition-all"
               >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="px-8 pb-8">
              <div className="relative -mt-16 mb-6">
                <div className="h-32 w-32 rounded-3xl bg-white p-2 shadow-xl">
                  <div className="h-full w-full rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-700 text-4xl font-bold border-2 border-white">
                    {(selectedStudentForView.user?.name || selectedStudentForView.userDetails?.name || '?').charAt(0)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{selectedStudentForView.user?.name || selectedStudentForView.userDetails?.name}</h3>
                    <p className="text-slate-500 font-medium">Student ID: {selectedStudentForView.studentId}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100"><Mail className="h-5 w-5 text-indigo-500" /></div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                        <p className="text-sm font-medium">{selectedStudentForView.user?.email || selectedStudentForView.userDetails?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100"><Phone className="h-5 w-5 text-indigo-500" /></div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</p>
                        <p className="text-sm font-medium">{selectedStudentForView.phone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-2xl bg-slate-50 p-6 border border-slate-100">
                    <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center"><Activity className="mr-2 h-4 w-4 text-indigo-500" /> Academic Standing</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5 uppercase"><span>Attendance</span><span>{selectedStudentForView.attendancePercentage || 0}%</span></div>
                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${selectedStudentForView.attendancePercentage || 0}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5 uppercase"><span>Performance</span><span>{selectedStudentForView.performanceScore || 0}%</span></div>
                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${selectedStudentForView.performanceScore || 0}%` }}></div>
                        </div>
                      </div>
                      <div className="pt-2 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-500 uppercase">Status</span>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          selectedStudentForView.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 
                          selectedStudentForView.status === 'INACTIVE' ? 'bg-slate-200 text-slate-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {selectedStudentForView.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center"><GraduationCap className="mr-2 h-4 w-4 text-indigo-500" /> Enrolled Courses</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedStudentForView.courses && selectedStudentForView.courses.length > 0 ? (
                    selectedStudentForView.courses.map((course: any) => (
                      <span key={course._id} className="rounded-xl bg-indigo-50 px-4 py-2 text-sm text-indigo-700 font-bold border border-indigo-100">
                        {course.title}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 italic">No courses assigned yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
