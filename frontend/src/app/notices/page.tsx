"use client"

import { useEffect, useState } from "react"
import { noticeService } from "@/api/services"
import { useAuth } from "@/context/AuthContext"
import { 
  Megaphone, 
  Plus, 
  Trash2, 
  Edit2, 
  Calendar, 
  Users, 
  Info,
  Loader2,
  X,
  CheckCircle2
} from "lucide-react"

export default function NoticesPage() {
  const { user } = useAuth()
  const [notices, setNotices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingNotice, setEditingNotice] = useState<any>(null)
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    audience: "ALL",
    expiryDate: ""
  })

  useEffect(() => {
    fetchNotices()
  }, [])

  const fetchNotices = async () => {
    try {
      setLoading(true)
      const data = await noticeService.getNotices()
      setNotices(data)
    } catch (err) {
      console.error("Failed to fetch notices", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingNotice) {
        await noticeService.updateNotice(editingNotice._id, formData)
      } else {
        await noticeService.createNotice(formData)
      }
      setShowModal(false)
      setEditingNotice(null)
      setFormData({ title: "", content: "", audience: "ALL", expiryDate: "" })
      fetchNotices()
    } catch (err) {
      console.error("Error saving notice", err)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      try {
        await noticeService.deleteNotice(id)
        fetchNotices()
      } catch (err) {
        console.error("Error deleting notice", err)
      }
    }
  }

  const openEditModal = (notice: any) => {
    setEditingNotice(notice)
    setFormData({
      title: notice.title,
      content: notice.content,
      audience: notice.audience,
      expiryDate: notice.expiryDate ? new Date(notice.expiryDate).toISOString().split('T')[0] : ""
    })
    setShowModal(true)
  }

  if (loading && notices.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notice Board</h1>
          <p className="mt-1 text-sm text-slate-500">Important announcements and updates for the academy.</p>
        </div>
        {user?.role === 'ADMIN' && (
          <button 
            onClick={() => {
              setEditingNotice(null)
              setFormData({ title: "", content: "", audience: "ALL", expiryDate: "" })
              setShowModal(true)
            }}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-all shadow-md active:scale-95"
          >
            <Plus className="h-4 w-4" />
            New Notice
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {notices.length > 0 ? (
          notices.map((notice) => (
            <div 
              key={notice._id} 
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-xl hover:ring-indigo-100"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  notice.audience === 'ALL' ? 'bg-blue-100 text-blue-700' : 
                  notice.audience === 'STUDENT' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {notice.audience}
                </div>
                {user?.role === 'ADMIN' && (
                  <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <button onClick={() => openEditModal(notice)} className="rounded-md p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(notice._id)} className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <h3 className="mb-2 text-lg font-bold text-slate-900 line-clamp-2">{notice.title}</h3>
              <p className="mb-6 flex-grow text-sm leading-relaxed text-slate-600 line-clamp-4">{notice.content}</p>

              <div className="mt-auto border-t border-slate-50 pt-4 flex items-center justify-between text-[11px] font-medium text-slate-400">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(notice.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-4 w-4 rounded-full bg-slate-100 flex items-center justify-center text-[8px] text-slate-600">
                    {notice.createdBy?.name?.charAt(0)}
                  </div>
                  {notice.createdBy?.name}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 mt-4">
            <div className="rounded-full bg-slate-50 p-4 mb-4">
              <Megaphone className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No active notices</h3>
            <p className="text-sm text-slate-500 mt-1">Check back later for important updates.</p>
          </div>
        )}
      </div>

      {/* Modal for Creating/Editing */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-xl font-bold text-slate-900">
                {editingNotice ? 'Edit Notice' : 'Post New Notice'}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Notice Title</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                  placeholder="e.g., Academy Holiday Announcement"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Content</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                  placeholder="Write the notice details here..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Target Audience</label>
                  <select 
                    value={formData.audience}
                    onChange={(e) => setFormData({...formData, audience: e.target.value})}
                    className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                  >
                    <option value="ALL">Everyone</option>
                    <option value="STUDENT">Students Only</option>
                    <option value="ADMIN">Admins Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Expiry Date (Optional)</label>
                  <input 
                    type="date" 
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                    className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors shadow-lg active:scale-95"
                >
                  {editingNotice ? 'Update Notice' : 'Post Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
