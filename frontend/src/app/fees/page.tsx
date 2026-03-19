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
import { useAuth } from "@/context/AuthContext"

export default function FeesPage() {
  const { user } = useAuth()
  const [fees, setFees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ student: "", amount: 0, dueDate: "" })
  const [studentsList, setStudentsList] = useState<any[]>([])
  const [payModal, setPayModal] = useState({ show: false, feeId: "", total: 0, paid: 0, amount: 0 })

  const fetchStudentsList = async () => {
    try {
      const { studentService } = await import("@/api/services")
      const data = await studentService.getStudents({ limit: 200 })
      setStudentsList(data.students || [])
    } catch (err) {
      console.error("Failed to fetch students list")
    }
  }

  useEffect(() => {
    if (user) {
      fetchFees()
      if (user.role === 'ADMIN') fetchStudentsList()
    }
  }, [user])

  const fetchFees = async () => {
    if (!user) return;
    try {
      setLoading(true)
      let data;
      const studentId = user.studentProfile?._id || user.studentProfile;
      
      if (user.role === 'STUDENT' && studentId) {
        data = await feeService.getStudentFees(studentId);
      } else if (user.role === 'ADMIN') {
        data = await feeService.getAllFees();
      }
      
      if (data) {
        setFees(Array.isArray(data) ? data : [data]);
      }
    } catch (err) {
      console.error("Failed to fetch fees", err)
      setFees([]);
    } finally {
      setLoading(false)
    }
  }

  const filteredFees = fees.filter((fee: any) => {
    const studentName = fee.student?.user?.name || fee.student?.name || fee.studentDetails?.name || ""
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

  const handlePayFee = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await feeService.payFee(payModal.feeId, payModal.amount, `TXN${Date.now()}`)
      setPayModal({ ...payModal, show: false })
      fetchFees()
      alert("Payment recorded successfully!")
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to record payment.")
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Fee Management</h1>
          <p className="text-slate-500">Track and manage student fee payments</p>
        </div>
        {user?.role === 'ADMIN' && (
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-all shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Fee Record
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search student name..."
            className="w-full rounded-xl border-0 bg-slate-50 py-2.5 pl-10 pr-4 text-sm ring-1 ring-inset ring-slate-200 outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select 
            className="rounded-xl border-0 bg-slate-50 px-4 py-2.5 text-sm ring-1 ring-inset ring-slate-200 outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium text-slate-600"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="PAID">Paid</option>
            <option value="PARTIAL">Partial</option>
            <option value="PENDING">Pending</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm glass">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4 text-center">Total Fee</th>
              <th className="px-6 py-4 text-center">Paid</th>
              <th className="px-6 py-4 text-center">Remaining</th>
              <th className="px-6 py-4">Due Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-500" />
                </td>
              </tr>
            ) : filteredFees.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-slate-500">
                  <div className="flex flex-col items-center">
                    <AlertCircle className="h-8 w-8 text-slate-300 mb-2" />
                    <p>No fee records found.</p>
                  </div>
                </td>
              </tr>
            ) : filteredFees.map((fee: any) => (
              <tr key={fee._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                      {(fee.student?.user?.name || fee.student?.name || fee.studentDetails?.name || '?').charAt(0)}
                    </div>
                    <div className="ml-3 font-medium text-slate-900">{fee.student?.user?.name || fee.student?.name || fee.studentDetails?.name || 'Unknown'}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-slate-600 font-bold">
                  ₹{(fee.totalAmount || fee.amount || 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-green-600 font-medium">
                  ₹{(fee.paidAmount || 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-rose-500 font-bold">
                  ₹{((fee.totalAmount || fee.amount || 0) - (fee.paidAmount || 0)).toLocaleString()}
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
                  ) : fee.status === 'PARTIAL' ? (
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                      <Clock className="mr-1 h-3 w-3" />
                      Partial
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                      <Clock className="mr-1 h-3 w-3" />
                      Pending
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  {user?.role === 'STUDENT' ? (
                    <span className="text-xs text-slate-400 italic">Reference Only</span>
                  ) : (
                    <div className="flex flex-col items-end gap-1">
                      {fee.status === 'PAID' ? (
                        <>
                          <button className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                            View Receipt
                          </button>
                          <button 
                            onClick={async () => {
                              if (confirm("Reset status to Pending? This will clear paid amount.")) {
                                await feeService.updateStatus(fee._id, 'PENDING');
                                fetchFees();
                              }
                            }}
                            className="text-[10px] text-slate-400 hover:text-rose-500 transition-colors"
                          >
                            Mark as Pending
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => setPayModal({ 
                              show: true, 
                              feeId: fee._id, 
                              total: fee.totalAmount || fee.amount || 0, 
                              paid: fee.paidAmount || 0,
                              amount: (fee.totalAmount || fee.amount || 0) - (fee.paidAmount || 0)
                            })}
                            className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
                          >
                            Record Payment
                          </button>
                          <div className="flex gap-2">
                            <button 
                              onClick={async () => {
                                if (confirm("Mark as fully PAID?")) {
                                  await feeService.updateStatus(fee._id, 'PAID');
                                  fetchFees();
                                }
                              }}
                              className="text-[10px] text-green-600 hover:text-green-700 font-medium"
                            >
                              Mark Paid
                            </button>
                            {fee.status !== 'PENDING' && (
                               <button 
                                onClick={async () => {
                                  if (confirm("Reset status to Pending?")) {
                                    await feeService.updateStatus(fee._id, 'PENDING');
                                    fetchFees();
                                  }
                                }}
                                className="text-[10px] text-slate-400 hover:text-rose-500"
                              >
                                Reset
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Record Payment Modal */}
      {payModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="text-lg font-semibold text-slate-900">Record Fee Payment</h3>
              <button onClick={() => setPayModal({...payModal, show: false})} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handlePayFee} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                   <p className="text-[10px] font-bold text-slate-400 uppercase">Total Fee</p>
                   <p className="text-lg font-bold text-slate-700">₹{payModal.total.toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                   <p className="text-[10px] font-bold text-slate-400 uppercase">Paid So Far</p>
                   <p className="text-lg font-bold text-green-600">₹{payModal.paid.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase">Payment Amount (₹)</label>
                <input 
                  required 
                  type="number"
                  min="1"
                  max={payModal.total - payModal.paid}
                  value={payModal.amount}
                  onChange={(e) => setPayModal({...payModal, amount: Number(e.target.value)})}
                  placeholder="Enter amount to pay"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" 
                />
                <p className="mt-1 text-[10px] text-rose-500 font-medium whitespace-nowrap">
                   Remaining balance: ₹{(payModal.total - payModal.paid).toLocaleString()}
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setPayModal({...payModal, show: false})}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-all shadow-md active:scale-95"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                      {s.user?.name || s.userDetails?.name || s.userId?.name} ({s.studentId})
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
