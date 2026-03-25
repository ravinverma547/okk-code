"use client"

import { useState, useEffect } from "react"
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  Search, 
  Plus, 
  BookOpen, 
  Loader2, 
  File as FileIcon,
  X,
  Library
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { studyMaterialService, courseService } from "@/api/services"
import { toast } from "sonner"

export default function StudyMaterialPage() {
  const { user } = useAuth()
  const [materials, setMaterials] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  
  // Upload form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [subject, setSubject] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("")
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    fetchMaterials()
    fetchCourses()
  }, [])

  const fetchMaterials = async () => {
    try {
      const data = await studyMaterialService.getMaterials()
      setMaterials(data)
    } catch (err) {
      toast.error("Failed to fetch study materials")
    } finally {
      setLoading(false)
    }
  }

  const fetchCourses = async () => {
    try {
      const data = await courseService.getCourses()
      setCourses(data)
    } catch (err) {}
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return toast.error("Please select a file")
    
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title)
    formData.append('description', description)
    formData.append('subject', subject)
    if (selectedCourse) formData.append('course', selectedCourse)

    try {
      await studyMaterialService.uploadMaterial(formData)
      toast.success("Material uploaded successfully")
      setShowUploadModal(false)
      fetchMaterials()
      // Reset form
      setTitle(""); setDescription(""); setSubject(""); setSelectedCourse(""); setFile(null);
    } catch (err) {
      toast.error("Failed to upload material")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this material?")) return
    try {
      await studyMaterialService.deleteMaterial(id)
      toast.success("Material deleted successfully")
      fetchMaterials()
    } catch (err) {
      toast.error("Failed to delete material")
    }
  }

  const filteredMaterials = materials.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText className="h-10 w-10 text-rose-500" />
      case 'IMG': return <FileIcon className="h-10 w-10 text-emerald-500" />
      default: return <FileIcon className="h-10 w-10 text-indigo-500" />
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Study Materials</h1>
          <p className="text-slate-500">Access and share academic resources, notes, and documents</p>
        </div>
        {(user?.role === 'ADMIN' || user?.role === 'TEACHER') && (
          <button 
            onClick={() => setShowUploadModal(true)}
            className="flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-500 transition-all shadow-md active:scale-95"
          >
            <Plus className="mr-2 h-4 w-4" />
            Upload Material
          </button>
        )}
      </div>

      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search by title or subject..."
          className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
          <Library className="h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-900">No materials found</h3>
          <p className="text-slate-500 text-sm max-w-xs">There are no study materials available yet. Start by uploading some notes or documents.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMaterials.map((m) => (
            <div key={m._id} className="group relative flex flex-col bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-xl hover:-translate-y-1 transition-all glass">
              <div className="mb-4 flex items-center justify-center h-20 w-20 mx-auto bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
                {getFileIcon(m.fileType)}
              </div>
              
              <div className="text-center mb-4">
                <h3 className="font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight text-sm">{m.title}</h3>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                  {m.subject}
                </span>
                <p className="text-xs text-slate-500 line-clamp-2 mt-2 min-h-[2.5rem] leading-relaxed">
                  {m.description || "No description provided."}
                </p>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 capitalize">Uploaded by</span>
                  <span className="text-xs font-bold text-slate-700">{m.uploadedBy?.name || "Teacher"}</span>
                </div>
                <div className="flex gap-2">
                  <a 
                    href={`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace('/api/v1', '')}${m.fileUrl}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors shadow-sm bg-white border border-slate-100"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                  {(user?.role === 'ADMIN' || (user?.role === 'TEACHER' && m.uploadedBy?._id === user?._id)) && (
                    <button 
                      onClick={() => handleDelete(m._id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-slate-100 shadow-sm bg-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden glass translate-y-0 shadow-indigo-500/10 border border-white">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                  <Upload className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 leading-none">Upload Resource</h2>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">Study Material</p>
                </div>
              </div>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpload} className="p-6 space-y-5 bg-white">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all"
                  placeholder="e.g. Mathematics Chapter 5 Notes"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Subject</label>
                  <input 
                    type="text" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all"
                    placeholder="e.g. Algebra"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Related Course</label>
                  <select 
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">No Course (General)</option>
                    {courses.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all resize-none h-20"
                  placeholder="Tell students what this resource is about..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">File</label>
                <div className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all ${file ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/50'}`}>
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <div className="flex flex-col items-center">
                    <div className={`p-3 rounded-xl mb-2 ${file ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                      <Upload className="h-6 w-6" />
                    </div>
                    {file ? (
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-emerald-700 truncate max-w-xs">{file.name}</p>
                        <p className="text-[10px] text-emerald-500">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready to upload</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-700">Click to upload file</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">PDF, DOC, JPG, or PNG (Max. 10MB)</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-3 text-sm font-extrabold text-slate-500 hover:bg-slate-50 rounded-xl transition-all border border-slate-100"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={uploading}
                  className="flex-3 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-extrabold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  Confirm Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
