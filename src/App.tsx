import { Home } from "./pages/home";
import { Cart } from "./pages/car";
import { Dashboard } from "./pages/dashboard";
import { New } from "./pages/dashboard/new";
import { Login } from "./pages/login";

import { createBrowserRouter } from 'react-router'
import { Layout } from "./components/layout";
import { Private } from "./routes/Private";

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
        element: <Private><Dashboard /></Private> 
      },
      {
        path: "/dashboard/new",
        element: <Private><New /></Private> 
      }
    ]
  },
  {
    path: "/login",
    element: <Login/>
  },
])

export { router }