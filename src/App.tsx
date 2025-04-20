import { RootRoute, Route, Router, RouterProvider } from "@tanstack/react-router";
import Hero from "./components/home/Hero";
import { SignInForm } from "./components/auth/SignInForm";
import ShareFile from "./components/files/SharedFile";

const rootRoute = new RootRoute({});

const indexRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/',
    component: Hero
});

const loginRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: SignInForm
})

const shareRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/share',
    component: ShareFile
})

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

const routeTree = rootRoute.addChildren([indexRoute, loginRoute, shareRoute]);

const router = new Router({ routeTree });

export default function App() {
    return <RouterProvider router={router} />
}