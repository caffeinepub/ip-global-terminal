import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import Layout from './components/Layout';
import Home from './pages/Home';
import RegisterIP from './pages/RegisterIP';
import IPDatabase from './pages/IPDatabase';
import Whitepaper from './pages/Whitepaper';

// Clear any stored admin tokens so the app is always publicly accessible
try {
  sessionStorage.removeItem('caffeineAdminToken');
  sessionStorage.removeItem('secret_caffeineAdminToken');
} catch {
  // ignore
}

const rootRoute = createRootRoute({
  component: Layout,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterIP,
});

const databaseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/database',
  component: IPDatabase,
});

const whitepaperRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/whitepaper',
  component: Whitepaper,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  registerRoute,
  databaseRoute,
  whitepaperRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
