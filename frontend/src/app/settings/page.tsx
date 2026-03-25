"use client"

import { useState } from "react"
import { 
  User, 
  Lock, 
  Phone, 
  Mail, 
  Shield, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { authService } from "@/api/services"
import { toast } from "sonner"

export default function SettingsPage() {
  const { user, login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  
  // Profile state
  const [name, setName] = useState(user?.name || "")
  const [phone, setPhone] = useState(user?.studentProfile?.phone || user?.teacherProfile?.phone || "")
  
  // Password state
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const updatedUser = await authService.updateProfile({ name, phone })
      // Update context and local storage
      const token = localStorage.getItem('token') || ""
      login(updatedUser, token)
      toast.success("Profile updated successfully")
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match")
    }
    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters")
    }

    setPasswordLoading(true)
    try {
      await authService.changePassword({ oldPassword, newPassword })
      toast.success("Password changed successfully")
      setOldPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to change password")
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
        <p className="text-slate-500 text-sm">Manage your profile information and security preferences</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Profile Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden glass">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Profile Information</h2>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mt-0.5">Basic Details</p>
            </div>
          </div>
          
          <form onSubmit={handleUpdateProfile} className="p-6 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                  placeholder="Your Name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                Email Address
              </label>
              <div className="relative opacity-60">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="email" 
                  value={user?.email || ""} 
                  disabled
                  className="w-full bg-slate-100 border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm cursor-not-allowed"
                />
              </div>
              <p className="text-[10px] text-slate-400">Email cannot be changed for security reasons</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                  placeholder="+91 00000 00000"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Changes
            </button>
          </form>
        </div>

        {/* Password Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden glass">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Security</h2>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mt-0.5">Password Management</p>
            </div>
          </div>
          
          <form onSubmit={handleChangePassword} className="p-6 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Current Password</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="password" 
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full bg-slate-50 border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-rose-100 focus:border-rose-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-50 border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-rose-100 focus:border-rose-500 outline-none transition-all"
                  placeholder="Min. 6 characters"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-50 border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-rose-100 focus:border-rose-500 outline-none transition-all"
                  placeholder="Confirm password"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={passwordLoading}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
            >
              {passwordLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
              Update Security
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
