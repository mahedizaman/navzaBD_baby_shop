import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import App from "./App";
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";
import ReactDOM from "react-dom/client";
import Users from "./pages/Users";
import Banner from "./pages/Banner";
import Brand from "./pages/Brand";
import Order from "./pages/Order";
import Invoices from "./pages/Invoices";
import Product from "./pages/Product";
import Categories from "./pages/Categories";

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, path: "/dashboard", element: <Dashboard /> },
      { path: "/dashboard/account", element: <Account /> },
      { path: "/dashboard/users", element: <Users /> },
      { path: "/dashboard/banner", element: <Banner /> },
      { path: "/dashboard/brand", element: <Brand /> },
      { path: "/dashboard/order", element: <Order /> },
      { path: "/dashboard/invoices", element: <Invoices /> },
      { path: "/dashboard/product", element: <Product /> },
      { path: "/dashboard/categories", element: <Categories /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
