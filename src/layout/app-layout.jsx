import Header from "@/components/Header";
import { Link, Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <>
      <div className="min-h-screen container">
        <main>
          <Header />
          <Outlet />
        </main>
      </div>
      <div className="p-5 text-center bg-gray-900 mt-10">
        Made with 💖 by
        <Link to="https://devpedia.in" target="_blank" className="ml-2">
          <em className="text-blue-400  font-semibold">devpedia.in</em>.
        </Link>
      </div>
    </>
  );
};

export default AppLayout;
