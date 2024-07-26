import CreateLink from "@/components/CreateLink";
import ErrorHandler from "@/components/ErrorHandler";
import LinkCard from "@/components/LinkCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UrlState } from "@/context/context";
import { getAnalyticOfUrls } from "@/db/analyticsApi";
import { getUrls } from "@/db/urlsApi";
import { useFetch } from "@/hooks/useFetch";
import { Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = UrlState();

  const {
    loading: LoadingUrls,
    error: UrlsError,
    data: UrlsData,
    fn: UrlsFunction,
  } = useFetch(getUrls, user?.id);

  const {
    loading: LoadingAnalytics,
    error: AnalyticsError,
    data: AnalyticsData,
    fn: AnalyticsFunction,
  } = useFetch(
    getAnalyticOfUrls,
    UrlsData?.map((url) => url.id)
  );

  useEffect(() => {
    UrlsFunction();
  }, []);

  useEffect(() => {
    if (UrlsData?.length) AnalyticsFunction();
  }, [UrlsData?.length]);

  const filteredUrls = UrlsData?.filter((url) =>
    url.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 mt-5">
      {(LoadingUrls || LoadingAnalytics) && (
        <BarLoader width={"100%"} color="#36d7b7" className="mt-5" />
      )}
      <div className="grid grid-cols-2 gap-6 ">
        <Card>
          <CardHeader>
            <CardTitle>Links Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{UrlsData?.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{AnalyticsData?.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <h1 className="text-4xl font-extrabold"> My Links</h1>
        <Button>
          <CreateLink />
        </Button>
      </div>
      <div className="relative">
        <Input
          type="text"
          placeholder="Search Links... "
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Filter className="absolute top-2 right-2 p-1" />
        {UrlsError ? (
          <ErrorHandler message={UrlsError?.message} />
        ) : (
          <ErrorHandler message={AnalyticsError?.message} />
        )}

        {(filteredUrls || []).map((url, i) => {
          return (
            <div className="my-5" key={i}>
              <LinkCard url={url} fetchUrls={UrlsFunction} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
