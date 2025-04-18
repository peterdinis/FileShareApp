import { useQuery } from 'convex/react';
import type { FC } from 'react';
import { api } from '../../../convex/_generated/api';
import { FileText, Download } from 'lucide-react';

type ShareFileProps = {
    shareCode: string;
};

const ShareFile: FC<ShareFileProps> = ({ shareCode }: ShareFileProps) => {
    const sharedFile = useQuery(api.files.getSharedFile, {
        accessCode: shareCode,
    });

    if (sharedFile === undefined) {
        return (
            <div className='flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100'>
                <div className='flex animate-pulse flex-col items-center p-8'>
                    <div className='mb-4 h-12 w-12 rounded-lg bg-slate-200'></div>
                    <div className='mb-2 h-6 w-32 rounded bg-slate-200'></div>
                    <div className='h-4 w-24 rounded bg-slate-200'></div>
                </div>
            </div>
        );
    }

    if (!sharedFile) {
        return (
            <div className='flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100'>
                <div className='mx-auto max-w-md rounded-xl bg-white p-8 text-center shadow-md'>
                    <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100'>
                        <FileText className='h-8 w-8 text-red-500' />
                    </div>
                    <h2 className='mb-2 text-2xl font-semibold text-slate-800'>
                        File Not Found
                    </h2>
                    <p className='text-slate-600'>
                        This share link is invalid or has expired.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className='flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100'>
            <div className='mx-auto max-w-md rounded-xl bg-white p-8 text-center shadow-md'>
                <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100'>
                    <FileText className='h-8 w-8 text-purple-600' />
                </div>
                <h2 className='mb-4 text-2xl font-semibold text-slate-800'>
                    Shared File
                </h2>
                <div className='mb-6 rounded-lg border border-slate-200 bg-slate-50 p-6'>
                    <h3 className='mb-2 font-medium text-slate-800'>
                        {sharedFile.name}
                    </h3>
                    <p className='mb-4 text-sm text-slate-500'>
                        {(sharedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <a
                        href={sharedFile.url ?? undefined}
                        download={sharedFile.name}
                        className='mx-auto flex w-full max-w-xs items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700'
                    >
                        <Download size={18} />
                        <span>Download File</span>
                    </a>
                </div>
                <p className='text-sm text-slate-500'>
                    This is a secure shared file link
                </p>
            </div>
        </div>
    );
};

export default ShareFile;
