import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./layout/app-layout";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Analytics from "./pages/Analytics";
import UrlProvider from "./context/context";
import RequireAuth from "./components/RequireAuth";
import RedirectLink from "./pages/RedirectLink";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      {
        path: "/dashboard",
        element: (
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        ),
      },
      { path: "/auth", element: <Auth /> },
      {
        path: "/link/:id",
        element: (
          <RequireAuth>
            <Analytics />
          </RequireAuth>
        ),
      },
      { path: "/:id", element: <RedirectLink /> },
    ],
  },
]);
function App() {
  return (
    <UrlProvider>
      <RouterProvider router={router} />;
    </UrlProvider>
  );
}

export default App;
