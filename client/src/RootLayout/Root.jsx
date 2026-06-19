import { Outlet } from "react-router-dom";
import Header from "../Share/Header";
import Footer from "../Share/Footer";

const RootLayout = () => {
  return (
    <div>
      <header>
        <Header />
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default RootLayout;
