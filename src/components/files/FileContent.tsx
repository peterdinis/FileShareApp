import type React from "react"

import { useQuery, useMutation, Authenticated, Unauthenticated } from "convex/react"
import { type FC, useRef, useState } from "react"
import { toast } from "sonner"
import { api } from "../../../convex/_generated/api"
import type { Id } from "../../../convex/_generated/dataModel"
import { SignInForm } from "../auth/SignInForm"
import { FileText, Upload, Download, Share2 } from "lucide-react"

const FileContent: FC = () => {
  const files = useQuery(api.files.listFiles)
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const saveFile = useMutation(api.files.saveFile)
  const createShare = useMutation(api.files.createShare)
  const fileInput = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const postUrl = await generateUploadUrl()
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      })
      const { storageId } = await result.json()
      await saveFile({
        storageId,
        name: file.name,
        size: file.size,
        type: file.type,
      })
      toast.success("File uploaded successfully!")
      if (fileInput.current) fileInput.current.value = ""
    } catch (error) {
      toast.error("Failed to upload file")
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  async function handleShare(fileId: Id<"files">) {
    try {
      const share = await createShare({ fileId })
      const shareUrl = `${window.location.origin}?share=${share.accessCode}`
      await navigator.clipboard.writeText(shareUrl)
      toast.success("Share link copied to clipboard!")
    } catch (error) {
      toast.error("Failed to create share link")
    }
  }

  return (
    <div className="flex flex-col gap-8 min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-16 md:py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-blue-50 opacity-70"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="mb-2">
            <FileText className="h-12 w-12 text-purple-600 mx-auto" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            File <span className="text-purple-600">Share</span>
          </h1>

          <Authenticated>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Upload, share, and manage your files securely in one place.
            </p>
            <div className="flex flex-col items-center gap-4">
              <input
                type="file"
                onChange={handleFileUpload}
                ref={fileInput}
                disabled={uploading}
                className="hidden"
                id="fileInput"
              />
              <label
                htmlFor="fileInput"
                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:bg-purple-700 transition cursor-pointer"
              >
                <Upload size={20} />
                {uploading ? "Uploading..." : "Upload File"}
              </label>
            </div>
          </Authenticated>

          <Unauthenticated>
            <p className="text-xl text-slate-600 mb-6">Sign in to share files securely</p>
          </Unauthenticated>
        </div>
      </div>

      <Unauthenticated>
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>

      <Authenticated>
        <div className="max-w-4xl mx-auto px-4 w-full">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <FileText className="h-6 w-6 text-purple-600" />
              Your Files
            </h2>

            <div className="space-y-4">
              {files?.map((file) => (
                <div
                  key={file._id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-purple-200 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-800">{file.name}</h3>
                      <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={file.url ?? undefined}
                      download={file.name}
                      className="flex items-center gap-1 bg-green-50 text-green-600 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 transition"
                    >
                      <Download size={16} />
                      <span>Download</span>
                    </a>
                    <button
                      onClick={() => handleShare(file._id)}
                      className="flex items-center gap-1 bg-purple-50 text-purple-600 border border-purple-200 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition"
                    >
                      <Share2 size={16} />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              ))}
              {files?.length === 0 && (
                <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                  <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 font-medium">No files uploaded yet</p>
                  <p className="text-slate-500 text-sm mt-1">Upload your first file to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Authenticated>
    </div>
  )
}

export default FileContent
