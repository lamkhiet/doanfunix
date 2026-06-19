import { AuthContextProvider } from "./Context/AuthContext";
import "./App.css";
import "./css/custom.css";
import "./css/style.default.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home/Home";
import RootLayout from "./RootLayout/Root";
import SignIn from "./Authentication/SignIn";
import SignUp from "./Authentication/SignUp";
import Shop from "./Shop/Shop";
import Cart from "./Cart/Cart";
import Detail from "./Shop/Detail";
import Checkout from "./Checkout/Checkout";
import Orders from "./Order/Orders";
import DetailOrder from "./Order/DetailOrder";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/signin",
        element: <SignIn />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/shop",
        element: <Shop />,
      },
      {
        path: "/products/detail/:prodId",
        element: <Detail />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/checkout",
        element: <Checkout />,
      },
      {
        path: "/orders",
        element: <Orders />,
      },
      {
        path: "/orders/:orderId",
        element: <DetailOrder />,
      },
    ],
  },
]);

function App() {
  return (
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  );
}

export default App;
