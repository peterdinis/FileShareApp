import { FC } from 'react';
import Header from './Header';
import { Toaster } from 'sonner';
import FileContent from '../files/FileContent';
import SharedFile from '../files/SharedFile';

const Hero: FC = () => {
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
};

export default Hero;
