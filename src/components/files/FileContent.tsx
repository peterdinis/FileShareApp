import {
    useQuery,
    useMutation,
    Authenticated,
    Unauthenticated,
} from 'convex/react';
import { ChangeEvent, type FC, useRef, useState } from 'react';
import { toast } from 'sonner';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { FileText, Upload, Download, Share2 } from 'lucide-react';
import { Link } from '@tanstack/react-router';

const FileContent: FC = () => {
    const files = useQuery(api.files.listFiles);
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const saveFile = useMutation(api.files.saveFile);
    const createShare = useMutation(api.files.createShare);
    const fileInput = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    async function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const postUrl = await generateUploadUrl();
            const result = await fetch(postUrl, {
                method: 'POST',
                headers: { 'Content-Type': file.type },
                body: file,
            });
            const { storageId } = await result.json();
            await saveFile({
                storageId,
                name: file.name,
                size: file.size,
                type: file.type,
            });
            toast.success('File uploaded successfully!');
            if (fileInput.current) fileInput.current.value = '';
        } catch (error) {
            toast.error('Failed to upload file');
            console.error(error);
        } finally {
            setUploading(false);
        }
    }

    async function handleShare(fileId: Id<'files'>) {
        try {
            const share = await createShare({ fileId });
            const shareUrl = `${window.location.origin}?share=${share.accessCode}`;
            await navigator.clipboard.writeText(shareUrl);
            toast.success('Share link copied to clipboard!');
        } catch (error) {
            toast.error('Failed to create share link');
        }
    }

    return (
        <div className='flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50'>
            {/* Hero Section */}
            <div className='relative overflow-hidden px-4 py-20 md:py-32'>
                {/* Background elements */}
                <div className='absolute left-0 top-0 h-full w-full'>
                    <div className='animate-blob absolute -right-24 -top-24 h-96 w-96 rounded-full bg-purple-200 opacity-30 mix-blend-multiply blur-3xl filter'></div>
                    <div className='animate-blob animation-delay-2000 absolute -left-24 top-1/2 h-96 w-96 rounded-full bg-blue-200 opacity-30 mix-blend-multiply blur-3xl filter'></div>
                    <div className='animate-blob animation-delay-4000 absolute -bottom-24 right-1/4 h-96 w-96 rounded-full bg-pink-200 opacity-20 mix-blend-multiply blur-3xl filter'></div>

                    <div className='absolute inset-0 bg-white/30 backdrop-blur-[100px]'></div>
                </div>

                <div className='relative mx-auto max-w-5xl text-center'>
                    <div className='mb-4 inline-block rounded-2xl bg-white/80 p-3 shadow-md backdrop-blur-sm'>
                        <div className='rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 p-3'>
                            <FileText className='h-10 w-10 text-white' />
                        </div>
                    </div>

                    <h1 className='mb-6 text-5xl font-extrabold md:text-6xl'>
                        <span className='bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent'>
                            File Share
                        </span>
                    </h1>

                    <Authenticated>
                        <p className='mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-slate-600'>
                            Upload, share, and manage your files securely in one
                            place.
                        </p>
                        <div className='flex flex-col items-center gap-4'>
                            <input
                                type='file'
                                onChange={handleFileUpload}
                                ref={fileInput}
                                disabled={uploading}
                                className='hidden'
                                id='fileInput'
                            />
                            <label
                                htmlFor='fileInput'
                                className='group flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-4 font-medium text-white shadow-lg transition-all duration-300 hover:shadow-purple-200/50'
                            >
                                <div className='rounded-full bg-white/20 p-1 transition-all duration-300 group-hover:bg-white/30'>
                                    <Upload size={20} />
                                </div>
                                <span>
                                    {uploading ? 'Uploading...' : 'Upload File'}
                                </span>
                            </label>
                        </div>
                    </Authenticated>

                    <Unauthenticated>
                        <p className='mx-auto mb-8 max-w-2xl text-xl text-slate-600'>
                            Secure, fast, and easy file sharing for everyone.
                        </p>

                        <Link href="/login" className="mt-3  font-bold text-center">Try now</Link>
                    </Unauthenticated>
                </div>
            </div>
            
            <Unauthenticated>
                <div className='mx-auto max-w-5xl px-4 pb-16'>
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                        <div className='rounded-2xl border border-slate-100 bg-white/70 p-6 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md'>
                            <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100'>
                                <Upload className='h-6 w-6 text-purple-600' />
                            </div>
                            <h3 className='mb-2 text-lg font-semibold text-slate-800'>
                                Easy Uploads
                            </h3>
                            <p className='text-slate-600'>
                                Drag and drop or select files to upload in
                                seconds.
                            </p>
                        </div>

                        <div className='rounded-2xl border border-slate-100 bg-white/70 p-6 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md'>
                            <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100'>
                                <Share2 className='h-6 w-6 text-indigo-600' />
                            </div>
                            <h3 className='mb-2 text-lg font-semibold text-slate-800'>
                                Simple Sharing
                            </h3>
                            <p className='text-slate-600'>
                                Generate shareable links with one click.
                            </p>
                        </div>

                        <div className='rounded-2xl border border-slate-100 bg-white/70 p-6 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md'>
                            <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100'>
                                <Download className='h-6 w-6 text-blue-600' />
                            </div>
                            <h3 className='mb-2 text-lg font-semibold text-slate-800'>
                                Fast Downloads
                            </h3>
                            <p className='text-slate-600'>
                                Download files instantly from any device.
                            </p>
                        </div>
                    </div>
                </div>
            </Unauthenticated>
            
            <Authenticated>
                <div className='mx-auto w-full max-w-5xl px-4 py-12'>
                    <div className='rounded-2xl border border-slate-100 bg-white/80 p-8 shadow-md backdrop-blur-sm'>
                        <div className='mb-8 flex items-center justify-between'>
                            <h2 className='flex items-center gap-2 text-2xl font-bold text-slate-800'>
                                <div className='rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 p-1.5'>
                                    <FileText className='h-5 w-5 text-white' />
                                </div>
                                <span>Your Files</span>
                            </h2>
                            <div className='rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600'>
                                {files?.length || 0} Files
                            </div>
                        </div>

                        <div className='space-y-4'>
                            {files?.map((file) => (
                                <div
                                    key={file._id}
                                    className='group flex flex-col rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-purple-200 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between'
                                >
                                    <div className='mb-3 flex items-center space-x-4 sm:mb-0'>
                                        <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600'>
                                            <FileText className='h-6 w-6 text-white' />
                                        </div>
                                        <div>
                                            <h3 className='mb-0.5 font-medium text-slate-800'>
                                                {file.name}
                                            </h3>
                                            <p className='text-sm text-slate-500'>
                                                {(
                                                    file.size /
                                                    1024 /
                                                    1024
                                                ).toFixed(2)}{' '}
                                                MB
                                            </p>
                                        </div>
                                    </div>
                                    <div className='ml-16 flex gap-3 sm:ml-0'>
                                        <a
                                            href={file.url ?? undefined}
                                            download={file.name}
                                            className='flex items-center gap-1.5 rounded-lg bg-slate-100 px-4 py-2 text-slate-700 transition-colors hover:bg-slate-200'
                                        >
                                            <Download size={16} />
                                            <span>Download</span>
                                        </a>
                                        <button
                                            onClick={() =>
                                                handleShare(file._id)
                                            }
                                            className='flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 px-4 py-2 text-white transition-all duration-200 hover:shadow-sm hover:shadow-purple-200/50'
                                        >
                                            <Share2 size={16} />
                                            <span>Share</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {files?.length === 0 && (
                                <div className='rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center'>
                                    <div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100'>
                                        <FileText className='h-10 w-10 text-slate-400' />
                                    </div>
                                    <p className='mb-2 text-lg font-medium text-slate-600'>
                                        No files uploaded yet
                                    </p>
                                    <p className='mb-6 text-slate-500'>
                                        Upload your first file to get started
                                    </p>
                                    <label
                                        htmlFor='fileInput'
                                        className='inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 font-medium text-white shadow-md transition-all duration-300 hover:shadow-purple-200/50'
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
};

export default FileContent;
