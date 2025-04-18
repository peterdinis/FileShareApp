import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Id } from "../convex/_generated/dataModel";

export default function App() {
  const shareCode = new URLSearchParams(window.location.search).get("share");
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-semibold accent-text">File Share</h2>
        <SignOutButton />
      </header>
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {shareCode ? <SharedFile shareCode={shareCode} /> : <Content />}
        </div>
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  const files = useQuery(api.files.listFiles);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveFile = useMutation(api.files.saveFile);
  const createShare = useMutation(api.files.createShare);
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();
      await saveFile({
        storageId,
        name: file.name,
        size: file.size,
        type: file.type,
      });
      toast.success("File uploaded successfully!");
      if (fileInput.current) fileInput.current.value = "";
    } catch (error) {
      toast.error("Failed to upload file");
      console.error(error);
    } finally {
      setUploading(false);
    }
  }

  async function handleShare(fileId: Id<"files">) {
    try {
      const share = await createShare({ fileId });
      const shareUrl = `${window.location.origin}?share=${share.accessCode}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to create share link");
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold accent-text mb-4">File Share</h1>
        <Authenticated>
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
              className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 transition"
            >
              {uploading ? "Uploading..." : "Upload File"}
            </label>
          </div>
        </Authenticated>
        <Unauthenticated>
          <p className="text-xl text-slate-600">Sign in to share files</p>
          <SignInForm />
        </Unauthenticated>
      </div>

      <Authenticated>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Your Files</h2>
          <div className="space-y-4">
            {files?.map((file) => (
              <div
                key={file._id}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
              >
                <div>
                  <h3 className="font-medium">{file.name}</h3>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={file.url ?? undefined}
                    download={file.name}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                  >
                    Download
                  </a>
                  <button
                    onClick={() => handleShare(file._id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                  >
                    Share
                  </button>
                </div>
              </div>
            ))}
            {files?.length === 0 && (
              <p className="text-center text-gray-500">No files uploaded yet</p>
            )}
          </div>
        </div>
      </Authenticated>
    </div>
  );
}

function SharedFile({ shareCode }: { shareCode: string }) {
  const sharedFile = useQuery(api.files.getSharedFile, { accessCode: shareCode });

  if (sharedFile === undefined) {
    return <div>Loading...</div>;
  }

  if (!sharedFile) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">File Not Found</h2>
        <p className="text-gray-600">This share link is invalid or has expired.</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-4">Shared File</h2>
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
        <h3 className="font-medium mb-2">{sharedFile.name}</h3>
        <p className="text-sm text-gray-500 mb-4">
          {(sharedFile.size / 1024 / 1024).toFixed(2)} MB
        </p>
        <a
          href={sharedFile.url ?? undefined}
          download={sharedFile.name}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          Download File
        </a>
      </div>
    </div>
  );
}
