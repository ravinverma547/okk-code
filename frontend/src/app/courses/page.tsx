"use client"

import { useState, useEffect } from "react"
import { 
  BookOpen, 
  Plus, 
  Search, 
  Clock, 
  DollarSign, 
  Users,
  Loader2,
  MoreVertical,
  Edit,
  Trash2,
  X
} from "lucide-react"
import { courseService } from "@/api/services"

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ title: "", description: "", duration: "6 Months", fees: 0, batch: "" })

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const data = await courseService.getCourses()
      setCourses(data)
    } catch (err) {
      console.error("Failed to fetch courses", err)
      // Fallback for demo
      setCourses([
        { _id: '1', title: 'Full Stack Web Development', fees: 45000, duration: '6 Months', batch: '2026-A', enrollmentCount: 25 },
        { _id: '2', title: 'Data Science & AI', fees: 55000, duration: '8 Months', batch: '2026-B', enrollmentCount: 18 },
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredCourses = courses.filter((c: any) => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await courseService.createCourse({
        ...formData,
        fees: Number(formData.fees)
      })
      setShowModal(false)
      fetchCourses()
      setFormData({ title: "", description: "", duration: "6 Months", fees: 0, batch: "" })
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create course")
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Course Catalog</h1>
          <p className="text-slate-500">Manage academic programs, fees, and batches</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-all shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Course
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search courses..."
          className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full flex h-48 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        ) : filteredCourses.map((course: any) => (
          <div key={course._id} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                <BookOpen className="h-6 w-6" />
              </div>
              <button className="text-slate-400 hover:text-slate-600 p-1">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{course.title}</h3>
              <p className="mt-1 text-sm text-slate-500 flex items-center">
                <Users className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
                {course.enrollmentCount || 0} Students Enrolled
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Duration</div>
                <div className="mt-1 flex items-center text-sm font-semibold text-slate-700">
                  <Clock className="mr-1.5 h-3.5 w-3.5 text-indigo-500" />
                  {course.duration}
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Fee Amount</div>
                <div className="mt-1 flex items-center text-sm font-semibold text-slate-900 font-mono">
                  ₹{course.fees?.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center text-xs font-medium text-slate-500">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                Batch: {course.batch}
              </div>
              <div className="flex space-x-2">
                <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-indigo-600 transition-all">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Course Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="text-lg font-semibold text-slate-900">Create New Course</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateCourse} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase">Course Title</label>
                  <input 
                    required 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Master React JS"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Short course description"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" 
                    rows={2}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-500 uppercase">Duration</label>
                  <input 
                    required 
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    placeholder="e.g. 6 Months"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-500 uppercase">Batch Name</label>
                  <input 
                    required
                    value={formData.batch}
                    onChange={(e) => setFormData({...formData, batch: e.target.value})}
                    placeholder="e.g. Morning-A"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase">Fees (₹)</label>
                  <input 
                    required
                    type="number"
                    min="0"
                    value={formData.fees}
                    onChange={(e) => setFormData({...formData, fees: Number(e.target.value)})}
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
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
