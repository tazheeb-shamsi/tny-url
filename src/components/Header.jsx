import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LinkIcon, LogOutIcon } from "lucide-react";
import { UrlState } from "@/context/context";
import { useFetch } from "@/hooks/useFetch";
import { BarLoader } from "react-spinners";
import { logout } from "@/db/authApi";

const Header = () => {
  const { user, fetchUser } = UrlState();
  const { loading, fn: LogoutFunction } = useFetch(logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    LogoutFunction().then(() => {
      fetchUser();
      navigate("/");
    });
  };
  return (
    <>
      <nav className="mt-5 flex justify-between">
        <Link to="/" className="flex line-clamp-2 text-center">
          <img
            src="https://devpedia.in/assets/images/site-logo.svg"
            alt="logo"
            width={36}
            height={36}
          />
          <h1 className="text-3xl px-2 font-extrabold italic">tny!</h1>
        </Link>
        <div>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage
                    src={user?.user_metadata?.profile_pic}
                    className="object-contain"
                  />
                  <AvatarFallback>
                    {user?.user_metadata?.name.charAt(0).toUpperCase() || "TNY"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mt-2 mr-6 md:mr-6 lg:mr-8 ">
                <DropdownMenuLabel>
                  {user?.user_metadata?.name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem>
                  <Link to="/dashboard" className="flex">
                    <LinkIcon className="mr-2 h-4 w-4" />
                    <span>Shorten Links</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-500 ">
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  <span onClick={handleLogout}>Logout </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button className="px-5" onClick={() => navigate("/auth")}>
              Login
            </Button>
          )}
        </div>
      </nav>
      {loading && (
        <BarLoader
          size={21}
          className="mt-4 mb-4"
          width={"100%"}
          color="white"
        />
      )}
    </>
  );
};

export default Header;
