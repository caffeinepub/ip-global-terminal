import { createRootRoute, createRoute, createRouter, RouterProvider, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import Layout from './components/Layout';
import ProfileSetupModal from './components/ProfileSetupModal';
import Home from './pages/Home';
import RegisterIP from './pages/RegisterIP';
import IPDatabase from './pages/IPDatabase';
import Whitepaper from './pages/Whitepaper';

function RootComponent() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <Layout>
      <Outlet />
      <ProfileSetupModal open={showProfileSetup} />
    </Layout>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const indexRoute = createRoute({
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
  indexRoute,
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
