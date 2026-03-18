import { Search, Bell, User, Menu } from "lucide-react"

export default function Navbar() {
  return (
    <header className="flex h-16 w-full items-center justify-between border-b bg-white px-6">
      <div className="flex w-full max-w-xl items-center">
        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search students, courses..."
            className="block w-full rounded-md border-0 bg-slate-50 py-1.5 pl-10 pr-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-600 outline-none transition-all duration-200"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors">
          <Bell className="h-5 w-5" />
        </button>
        <div className="h-8 w-px bg-slate-200"></div>
        <button className="flex items-center space-x-2 rounded-md p-1 hover:bg-slate-50 transition-colors">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 ring-1 ring-slate-200">
            <User className="h-5 w-5 text-slate-600" />
          </div>
          <span className="hidden text-sm font-medium text-slate-700 md:block">Admin</span>
        </button>
      </div>
    </header>
  )
}
