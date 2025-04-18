import { Toaster } from "sonner";
import Header from "./components/home/Header";
import FileContent from "./components/files/FileContent";
import SharedFile from "./components/files/SharedFile";

export default function App() {
  const shareCode = new URLSearchParams(window.location.search).get("share");
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {shareCode ? <SharedFile shareCode={shareCode} /> : <FileContent />}
        </div>
      </main>
      <Toaster />
    </div>
  );
}