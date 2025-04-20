import { useAuthActions } from '@convex-dev/auth/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Mail, Lock, UserPlus, LogIn, User } from 'lucide-react';
import { useRouter } from '@tanstack/react-router';

export function SignInForm() {
    const { signIn } = useAuthActions();
    const [flow, setFlow] = useState<'signIn' | 'signUp'>('signIn');
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    return (
        <div className='w-full'>
            <div className='mb-8 text-center'>
                <div className='mb-5 inline-flex rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 p-3 shadow-lg'>
                    <div className='rounded-full bg-white p-3'>
                        {flow === 'signIn' ? (
                            <LogIn className='h-6 w-6 text-indigo-600' />
                        ) : (
                            <UserPlus className='h-6 w-6 text-indigo-600' />
                        )}
                    </div>
                </div>
                <h2 className='mb-2 text-2xl font-bold text-slate-800'>
                    {flow === 'signIn' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className='text-slate-600'>
                    {flow === 'signIn'
                        ? 'Sign in to access your files'
                        : 'Sign up to start sharing files'}
                </p>
            </div>

            <form
                className='flex flex-col gap-5'
                onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitting(true);
                    const formData = new FormData(e.target as HTMLFormElement);
                    formData.set('flow', flow);
                    void signIn('password', formData)
                        .then(() => {
                            router.navigate('/');
                        })
                        .catch((_error) => {
                            const toastTitle =
                                flow === 'signIn'
                                    ? 'Could not sign in, did you mean to sign up?'
                                    : 'Could not sign up, did you mean to sign in?';
                            toast.error(toastTitle);
                            setSubmitting(false);
                        });
                }}
            >
                <div className='group relative'>
                    <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4'>
                        <Mail className='h-5 w-5 text-slate-400 transition-colors group-focus-within:text-purple-500' />
                    </div>
                    <input
                        className='w-full rounded-xl border-2 border-slate-200 bg-white py-3.5 pl-12 pr-4 outline-none transition-all duration-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100'
                        type='email'
                        name='email'
                        placeholder='Email'
                        required
                    />
                </div>

                <div className='group relative'>
                    <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4'>
                        <Lock className='h-5 w-5 text-slate-400 transition-colors group-focus-within:text-purple-500' />
                    </div>
                    <input
                        className='w-full rounded-xl border-2 border-slate-200 bg-white py-3.5 pl-12 pr-4 outline-none transition-all duration-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100'
                        type='password'
                        name='password'
                        placeholder='Password'
                        required
                    />
                </div>

                <button
                    className='mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3.5 font-medium text-white shadow-md transition-all duration-200 hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg'
                    type='submit'
                    disabled={submitting}
                >
                    {flow === 'signIn' ? (
                        <>
                            <LogIn size={18} className='animate-pulse' />
                            <span>
                                {submitting ? 'Signing in...' : 'Sign in'}
                            </span>
                        </>
                    ) : (
                        <>
                            <UserPlus size={18} className='animate-pulse' />
                            <span>
                                {submitting ? 'Signing up...' : 'Sign up'}
                            </span>
                        </>
                    )}
                </button>

                <div className='mt-2 text-center text-sm text-slate-600'>
                    <span>
                        {flow === 'signIn'
                            ? "Don't have an account? "
                            : 'Already have an account? '}
                    </span>
                    <button
                        type='button'
                        className='cursor-pointer font-medium text-indigo-600 transition-colors hover:text-indigo-700 hover:underline'
                        onClick={() =>
                            setFlow(flow === 'signIn' ? 'signUp' : 'signIn')
                        }
                    >
                        {flow === 'signIn'
                            ? 'Sign up instead'
                            : 'Sign in instead'}
                    </button>
                </div>
            </form>

            <div className='my-6 flex items-center justify-center'>
                <hr className='grow border-slate-200' />
                <span className='mx-4 rounded-full bg-slate-50 px-3 py-1 text-sm font-medium text-slate-400'>
                    or
                </span>
                <hr className='grow border-slate-200' />
            </div>

            <button
                className='flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow'
                onClick={() =>
                    void signIn('anonymous').then(() => {
                        router.navigate('/');
                    })
                }
            >
                <User size={18} className='text-slate-500' />
                <span>Sign in anonymously</span>
            </button>
        </div>
    );
}
