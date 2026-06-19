import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Users from "./Users/Users";
import Login from "./Login/Login";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import { AuthContextProvider } from "./Context/AuthContext";
import UpdateUser from "./Users/UpdateUser";
import CreateUser from "./Users/CreateUser";
import Products from "./Products/Products";
import UpdateProduct from "./Products/UpdateProduct";
import CreateProduct from "./Products/CreateProduct";
import Categories from "./Category/Categories";
import CreateCategory from "./Category/CreateCategory";
import Customers from "./Customer/Customers";
import UpdateCustomer from "./Customer/UpdateCustomer";
import CreateCustomer from "./Customer/CreateCustomer";
import UpdateCategory from "./Category/UpdateCategory";
import Orders from "./Order/Orders";
import UpdateOrder from "./Order/UpdateOrder";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Navigate to="/login" replace />,
    },

    {
      path: "/login",
      element: <Login />,
    },

    {
      element: <ProtectedRoute />,
      children: [
        {
          path: "/users",
          element: <Users />,
        },
        {
          path: "/users/update/:userId",
          element: <UpdateUser />,
        },
        {
          path: "/users/new",
          element: <CreateUser />,
        },

        {
          path: "/customers",
          element: <Customers />,
        },
        {
          path: "/customers/update/:customerId",
          element: <UpdateCustomer />,
        },
        {
          path: "/customers/new",
          element: <CreateCustomer />,
        },

        {
          path: "/products",
          element: <Products />,
        },
        {
          path: "/products/update/:productId",
          element: <UpdateProduct />,
        },
        {
          path: "/products/new",
          element: <CreateProduct />,
        },

        {
          path: "/categories",
          element: <Categories />,
        },
        {
          path: "/categories/update/:categoryId",
          element: <UpdateCategory />,
        },
        {
          path: "/categories/new",
          element: <CreateCategory />,
        },

        {
          path: "/orders",
          element: <Orders />,
        },
        {
          path: "/orders/update/:orderId",
          element: <UpdateOrder />,
        },
      ],
    },

    {
      path: "*",
      element: <Navigate to="/login" replace />,
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  },
);

function App() {
  return (
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  );
}

export default App;
