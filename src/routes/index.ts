import {
    RootRoute,
    Route,
    Router,
} from '@tanstack/react-router';
import Hero from '@/components/home/Hero';
import ShareFile from '@/components/files/SharedFile';
import { SignInForm } from '@/components/auth/SignInForm';


const rootRoute = new RootRoute({});

const indexRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/',
    component: Hero,
});

const loginRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: SignInForm,
});

const shareRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/share',
    component: ShareFile,
});

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

const routeTree = rootRoute.addChildren([indexRoute, loginRoute, shareRoute]);

export const router = new Router({ routeTree });