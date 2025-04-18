import type { FC } from "react"
import { SignOutButton } from "../auth/SignOutButton"
import { FileText } from "lucide-react"

const Header: FC = () => {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl font-bold text-slate-800">File Share</h2>
        </div>
        <SignOutButton />
      </div>
    </header>
  )
}

export default Header
