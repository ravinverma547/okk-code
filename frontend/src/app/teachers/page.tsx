"use client"

import { useState, useEffect } from "react"
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  BookOpen, 
  GraduationCap,
  Calendar,
  CheckCircle2,
  XCircle,
  Plus,
  Loader2
} from "lucide-react"
import { teacherService } from "@/api/services"
import { courseService } from "@/api/services"
import { toast } from "sonner"

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "password123", // Default password
    phone: "",
    teacherId: "",
    subjects: "",
    qualification: "",
    experience: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [teachersData, coursesData] = await Promise.all([
        teacherService.getTeachers(),
        courseService.getCourses()
      ])
      setTeachers(teachersData.teachers)
      setCourses(coursesData)
    } catch (error) {
      console.error("Failed to fetch data:", error)
      toast.error("Failed to load teachers or courses")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        subjects: formData.subjects.split(',').map(s => s.trim())
      }
      await teacherService.registerTeacher(payload)
      toast.success("Teacher registered successfully")
      setIsModalOpen(false)
      fetchData()
      setFormData({
        name: "",
        email: "",
        password: "password123",
        phone: "",
        teacherId: "",
        subjects: "",
        qualification: "",
        experience: "",
      })
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to register teacher")
    }
  }

  const filteredTeachers = teachers.filter(teacher => 
    teacher.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.teacherId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subjects.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Teacher Management</h1>
          <p className="text-slate-500 mt-1">Manage and register faculty members.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-200"
        >
          <UserPlus className="h-5 w-5" />
          <span>Register Teacher</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Users className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Teachers</p>
            <p className="text-2xl font-bold text-slate-900">{teachers.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Active Now</p>
            <p className="text-2xl font-bold text-slate-900">{teachers.filter(t => t.status === 'ACTIVE').length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="h-14 w-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <BookOpen className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Courses Led</p>
            <p className="text-2xl font-bold text-slate-900">
              {teachers.reduce((acc, curr) => acc + curr.assignedCourses.length, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search by name, ID or subject..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl font-medium text-slate-600 transition-all">
          <Filter className="h-5 w-5" />
          <span>Filters</span>
        </button>
      </div>

      {/* Teachers List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
          <p className="mt-4 text-slate-500 font-medium">Loading faculty members...</p>
        </div>
      ) : filteredTeachers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <div key={teacher._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-inner">
                      {teacher.user.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{teacher.user.name}</h3>
                      <p className="text-xs text-slate-400 font-mono tracking-wider">{teacher.teacherId}</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-slate-600 text-sm">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="truncate">{teacher.user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 text-sm">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span>{teacher.phone || 'Not provided'}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Expertise</p>
                  <div className="flex flex-wrap gap-2">
                    {teacher.subjects.map((sub: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full border border-indigo-100">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-600">{teacher.assignedCourses.length} Courses</span>
                </div>
                <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  teacher.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {teacher.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
            <Users className="h-10 w-10" />
          </div>
          <p className="mt-4 text-slate-500 font-medium text-lg">No teachers found matching your search.</p>
        </div>
      )}

      {/* Register Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden scale-in-95 duration-200">
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Register New Teacher</h2>
                <p className="text-slate-500 text-sm">Create a new faculty account.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <Plus className="h-6 w-6 rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Full Name</label>
                  <input 
                    name="name"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. Dr. Robert Wilson"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Email Address</label>
                  <input 
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
                    placeholder="robert@school.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Teacher ID</label>
                  <input 
                    name="teacherId"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
                    placeholder="TCH-2024-001"
                    value={formData.teacherId}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                  <input 
                    name="phone"
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Subjects (comma separated)</label>
                  <input 
                    name="subjects"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
                    placeholder="Mathematics, Physics, Calculus"
                    value={formData.subjects}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Qualification</label>
                  <input 
                    name="qualification"
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
                    placeholder="Ph.D. in Computer Science"
                    value={formData.qualification}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Experience (years)</label>
                  <input 
                    name="experience"
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. 10"
                    value={formData.experience}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="mt-10 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3.5 rounded-xl font-bold text-slate-600 hover:bg-slate-50 border border-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3.5 bg-indigo-600 rounded-xl font-bold text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
