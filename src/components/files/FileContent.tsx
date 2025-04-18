"use client"

import type React from "react"

import { useQuery, useMutation, Authenticated, Unauthenticated } from "convex/react"
import { type FC, useRef, useState } from "react"
import { toast } from "sonner"
import { api } from "../../../convex/_generated/api"
import type { Id } from "../../../convex/_generated/dataModel"
import { SignInForm } from "../auth/SignInForm"
import { FileText, Upload, Download, Share2 } from 'lucide-react'

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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-20 md:py-32 px-4">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-1/2 -left-24 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          
          <div className="absolute inset-0 bg-white/30 backdrop-blur-[100px]"></div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-block p-3 mb-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-xl">
              <FileText className="h-10 w-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              File Share
            </span>
          </h1>

          <Authenticated>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
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
                className="group flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-purple-200/50 transition-all duration-300 cursor-pointer"
              >
                <div className="bg-white/20 p-1 rounded-full transition-all duration-300 group-hover:bg-white/30">
                  <Upload size={20} />
                </div>
                <span>{uploading ? "Uploading..." : "Upload File"}</span>
              </label>
            </div>
          </Authenticated>

          <Unauthenticated>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Secure, fast, and easy file sharing for everyone.
            </p>
          </Unauthenticated>
        </div>
      </div>

      {/* Features Section - Only show when unauthenticated */}
      <Unauthenticated>
        <div className="max-w-5xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Easy Uploads</h3>
              <p className="text-slate-600">
                Drag and drop or select files to upload in seconds.
              </p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <Share2 className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Simple Sharing</h3>
              <p className="text-slate-600">
                Generate shareable links with one click.
              </p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Download className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Fast Downloads</h3>
              <p className="text-slate-600">
                Download files instantly from any device.
              </p>
            </div>
          </div>
        </div>
      </Unauthenticated>

      {/* Authentication Section */}
      <Unauthenticated>
        <div className="max-w-md mx-auto px-4 pb-20">
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-slate-100">
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>

      {/* Files Section */}
      <Authenticated>
        <div className="max-w-5xl mx-auto px-4 py-12 w-full">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-slate-100 p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-1.5 rounded-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <span>Your Files</span>
              </h2>
              <div className="bg-slate-100 px-3 py-1.5 rounded-full text-sm font-medium text-slate-600">
                {files?.length || 0} Files
              </div>
            </div>

            <div className="space-y-4">
              {files?.map((file) => (
                <div
                  key={file._id}
                  className="group flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-purple-200 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-800 mb-0.5">{file.name}</h3>
                      <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <div className="flex gap-3 ml-16 sm:ml-0">
                    <a
                      href={file.url ?? undefined}
                      download={file.name}
                      className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      <Download size={16} />
                      <span>Download</span>
                    </a>
                    <button
                      onClick={() => handleShare(file._id)}
                      className="flex items-center gap-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:shadow-sm hover:shadow-purple-200/50 transition-all duration-200"
                    >
                      <Share2 size={16} />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              ))}
              {files?.length === 0 && (
                <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
                  <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
                    <FileText className="h-10 w-10 text-slate-400" />
                  </div>
                  <p className="text-slate-600 font-medium text-lg mb-2">No files uploaded yet</p>
                  <p className="text-slate-500 mb-6">Upload your first file to get started</p>
                  <label
                    htmlFor="fileInput"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-full font-medium shadow-md hover:shadow-purple-200/50 transition-all duration-300 cursor-pointer"
                  >
                    <Upload size={18} />
                    <span>Upload Now</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      </Authenticated>
    </div>
  );
}

export default FileContent
