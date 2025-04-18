import { Toaster } from 'sonner';
import Header from './components/home/Header';
import FileContent from './components/files/FileContent';
import SharedFile from './components/files/SharedFile';

export default function App() {
    const shareCode = new URLSearchParams(window.location.search).get('share');

    return (
        <div className='flex min-h-screen flex-col'>
            <Header />
            <main className='flex-1 p-8'>
                <div className='mx-auto max-w-4xl'>
                    {shareCode ? (
                        <SharedFile shareCode={shareCode} />
                    ) : (
                        <FileContent />
                    )}
                </div>
            </main>
            <Toaster />
        </div>
    );
}
