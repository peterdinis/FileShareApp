import { useAuthActions } from '@convex-dev/auth/react';
import { useConvexAuth } from 'convex/react';
import { LogOut } from 'lucide-react';

export function SignOutButton() {
    const { isAuthenticated } = useConvexAuth();
    const { signOut } = useAuthActions();

    if (!isAuthenticated) {
        return null;
    }

    return (
        <button
            className='flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-slate-700 transition-colors hover:bg-slate-200'
            onClick={() => void signOut()}
        >
            <LogOut size={18} />
            <span>Sign out</span>
        </button>
    );
}
