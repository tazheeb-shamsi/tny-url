import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { UrlState } from "@/context/context";
import { ClipLoader } from "react-spinners";

function RequireAuth({ children }) {
  const navigate = useNavigate();
  const { loading, isAuthenticated } = UrlState();

  useEffect(() => {
    if (!isAuthenticated && loading === false) navigate("/auth");
  }, [isAuthenticated, loading]);

  if (loading)
    return <ClipLoader size={21} color="#36d7b7" width={"100%"} />;
  if (isAuthenticated) return children;
}
export default RequireAuth;
