import { storeAnalytics } from "@/db/analyticsApi";
import { getLongUrlToRedirect } from "@/db/urlsApi";
import { useFetch } from "@/hooks/useFetch";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader, ClipLoader } from "react-spinners";

const RedirectLink = () => {
  const { id } = useParams();
  const { data, loading, fn } = useFetch(getLongUrlToRedirect, id);
  const { loading: LoadingAnalytics, fn: AnalyticsFunction } = useFetch(
    storeAnalytics,
    {
      id: data?.id,
      originalUrl: data?.original_url,
    }
  );

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (!loading && data) {
      AnalyticsFunction();
    }
  }, [loading]);

  if (loading || LoadingAnalytics) {
    return (
      <div className="my-3">
        <BarLoader width={"100%"} color="#00FFD1" />
        <br />
        <div className="flex flex-1 items-center justify-center text-2xl gap-2">
          <ClipLoader size={22} color="#36d7b7" /> Redirecting please wait...
        </div>
      </div>
    );
  }
  return null;
};

export default RedirectLink;
