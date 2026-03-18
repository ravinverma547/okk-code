"use client"

import { useState, useEffect } from "react"
import { 
  CreditCard, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Plus,
  Loader2,
  DollarSign,
  X
} from "lucide-react"
import { feeService } from "@/api/services"

export default function FeesPage() {
  const [fees, setFees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ student: "", amount: 0, dueDate: "" })
  const [studentsList, setStudentsList] = useState<any[]>([])

  useEffect(() => {
    fetchFees()
    fetchStudentsList()
  }, [])

  const fetchStudentsList = async () => {
    try {
      const { studentService } = await import("@/api/services")
      const data = await studentService.getStudents({ limit: 200 })
      setStudentsList(data.students || [])
    } catch (err) {
      console.error("Failed to fetch custom students list")
    }
  }

  const fetchFees = async () => {
    try {
      const data = await feeService.getAllFees()
      setFees(data)
    } catch (err) {
      console.error("Failed to fetch fees", err)
      // Fallback dummy for demo if endpoint not ready
      setFees([
        { _id: '1', student: { name: 'Rahul Sharma' }, amount: 5000, status: 'PAID', dueDate: '2026-03-15' },
        { _id: '2', student: { name: 'Priya Singh' }, amount: 12000, status: 'PENDING', dueDate: '2026-04-01' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredFees = fees.filter((fee: any) => {
    const studentName = fee.student?.name || fee.studentDetails?.name || ""
    const matchesSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || fee.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleCreateFee = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await feeService.createFee({
        ...formData,
        amount: Number(formData.amount)
      })
      setShowModal(false)
      fetchFees()
      setFormData({ student: "", amount: 0, dueDate: "" })
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create fee record")
    }
  }

  const handlePayFee = async (feeId: string) => {
    if (confirm("Mark this fee as Paid?")) {
      try {
        await feeService.payFee(feeId, `TXN${Date.now()}`)
        fetchFees()
        alert("Fee marked as paid!")
      } catch (err: any) {
        alert(err.response?.data?.message || "Failed to record payment.")
      }
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Fee Management</h1>
          <p className="text-slate-500">Track and manage student fee payments</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-all shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Fee Record
        </button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search student name..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select 
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Due Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-500" />
                </td>
              </tr>
            ) : filteredFees.map((fee: any) => (
              <tr key={fee._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                      {(fee.student?.name || fee.student?.user?.name || fee.studentDetails?.name || '?').charAt(0)}
                    </div>
                    <div className="ml-3 font-medium text-slate-900">{fee.student?.name || fee.student?.user?.name || fee.studentDetails?.name || 'Unknown'}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-medium">
                  ₹{fee.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-sm">
                  {new Date(fee.dueDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {fee.status === 'PAID' ? (
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Paid
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                      <Clock className="mr-1 h-3 w-3" />
                      Pending
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  {fee.status === 'PAID' ? (
                    <button className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                      View Receipt
                    </button>
                  ) : (
                    <button 
                      onClick={() => handlePayFee(fee._id)}
                      className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
                    >
                      Record Payment
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Fee Record Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="text-lg font-semibold text-slate-900">Create Fee Record</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateFee} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase">Select Student</label>
                <select 
                  required 
                  value={formData.student}
                  onChange={(e) => setFormData({...formData, student: e.target.value})}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white" 
                >
                  <option value="" disabled>Select a student</option>
                  {studentsList.map(s => (
                    <option key={s._id} value={s._id}>
                      {s.userDetails?.name || s.userId?.name} ({s.studentId})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase">Fee Amount (₹)</label>
                <input 
                  required 
                  type="number"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                  placeholder="e.g. 5000"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase">Due Date</label>
                <input 
                  required 
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" 
                />
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
                  Create Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
