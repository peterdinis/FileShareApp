import { useQuery } from "convex/react"
import type { FC } from "react"
import { api } from "../../../convex/_generated/api"
import { FileText, Download } from "lucide-react"

type ShareFileProps = {
  shareCode: string
}

const ShareFile: FC<ShareFileProps> = ({ shareCode }: ShareFileProps) => {
  const sharedFile = useQuery(api.files.getSharedFile, { accessCode: shareCode })

  if (sharedFile === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="animate-pulse flex flex-col items-center p-8">
          <div className="h-12 w-12 bg-slate-200 rounded-lg mb-4"></div>
          <div className="h-6 w-32 bg-slate-200 rounded mb-2"></div>
          <div className="h-4 w-24 bg-slate-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!sharedFile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-xl shadow-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <FileText className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-slate-800">File Not Found</h2>
          <p className="text-slate-600">This share link is invalid or has expired.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="text-center max-w-md mx-auto p-8 bg-white rounded-xl shadow-md">
        <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
          <FileText className="h-8 w-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-semibold mb-4 text-slate-800">Shared File</h2>
        <div className="p-6 bg-slate-50 rounded-lg border border-slate-200 mb-6">
          <h3 className="font-medium mb-2 text-slate-800">{sharedFile.name}</h3>
          <p className="text-sm text-slate-500 mb-4">{(sharedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          <a
            href={sharedFile.url ?? undefined}
            download={sharedFile.name}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors mx-auto w-full max-w-xs"
          >
            <Download size={18} />
            <span>Download File</span>
          </a>
        </div>
        <p className="text-sm text-slate-500">This is a secure shared file link</p>
      </div>
    </div>
  )
}

export default ShareFile
