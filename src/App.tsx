import { Home } from "./pages/home";
import { Cart } from "./pages/car";
import { Dashboard } from "./pages/dashboard";
import { New } from "./pages/dashboard/new";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { createBrowserRouter } from 'react-router'
import { Layout } from "./components/layout";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/cart/",
        element: <Cart />
      },
      {
        path: "/dashboard",
        element: <Dashboard />
      },
      {
        path: "/dashboard/new",
        element: <New />
      }
    ]
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/register",
    element: <Register/>
  }
])

export { router }