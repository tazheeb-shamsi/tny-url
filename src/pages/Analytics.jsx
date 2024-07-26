import DeviceAnalysis from "@/components/DeviceAnalysis";
import LocationAnalysis from "@/components/LocationAnalysis";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UrlState } from "@/context/context";
import { getAnalyticsOfUrl } from "@/db/analyticsApi";
import { deleteUrl, getUrlInfo } from "@/db/urlsApi";
import { useFetch } from "@/hooks/useFetch";
import {
  Clock,
  Copy,
  CopyCheck,
  Download,
  LinkIcon,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BarLoader, ClipLoader } from "react-spinners";

const Analytics = () => {
  const { id } = useParams();
  const { user } = UrlState();
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);

  const {
    loading: loadingUrlInfo,
    data: urlInfoData,
    error,
    fn: fnGetUrlInfo,
  } = useFetch(getUrlInfo, {
    id,
    user_id: user?.id,
  });

  const {
    loading: loadingAnalyticsOfUrl,
    data: analyticsOfUrlData,
    fn: fnGetAnalyticsOfUrl,
  } = useFetch(getAnalyticsOfUrl, {
    urlId: id,
  });

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, id);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(
      `http://localhost:5173/${urlInfoData?.short_url}`
    );
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1300);
  };

  const handleDownloadQR = async () => {
    const imgUrl = urlInfoData?.qr;
    const fileName = urlInfoData?.title;

    try {
      // Fetch the image data as blob
      const response = await fetch(imgUrl);
      const blob = await response.blob();

      // Create a blob URL for the blob
      const blobUrl = URL.createObjectURL(blob);

      // Create an anchor element
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = fileName || "qrcode.png";

      // Append the anchor element to the body
      document.body.appendChild(anchor);

      // Trigger the download by simulating a click event
      anchor.click();

      // Remove the anchor element from the body
      document.body.removeChild(anchor);

      // Clean up the blob URL
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error("Error downloading QR code:", e.message);
    }
  };

  useEffect(() => {
    fnGetUrlInfo();
    fnGetAnalyticsOfUrl();
  }, []);

  if (error) {
    navigate("/dashboard");
  }

  let link = "";
  if (urlInfoData) {
    link = urlInfoData?.custom_url
      ? urlInfoData?.custom_url
      : urlInfoData?.short_url;
  }
  return (
    <>
      {(loadingUrlInfo || loadingAnalyticsOfUrl) && (
        <BarLoader width={"100%"} color="#36d7b7" className="my-5" />
      )}
      <div className="flex w-full flex-col gap-8 mt-5 sm:flex-row justify-between">
        <div className="flex flex-col items-start gap-8 rounded-lg sm:w-2/5">
          <span className="text-6xl font-extrabold hover:underline cursor-pointer">
            {urlInfoData?.title}
          </span>
          <a
            href={`https://tny.in/${link}`}
            target="_blank"
            className="text-3xl sm:text-4xl text-blue-400 font-bold hover:underline cursor-pointer"
          >
            https://tny.in/{link}
          </a>
          <a
            href={urlInfoData?.original_url}
            target="_blank"
            className="flex items-center gap-2 hover:underline cursor-pointer"
          >
            <LinkIcon size={16} />
            {urlInfoData?.original_url}
          </a>
          <span className="flex items-center font-extralight text-sm gap-2">
            <Clock size={16} />
            {new Date(urlInfoData?.created_at).toLocaleString()}
          </span>
          <div className="flex gap-1 justify-center md:justify-end">
            <Button variant="ghost" onClick={handleCopyToClipboard}>
              {copied ? (
                <CopyCheck color="#88D66C" />
              ) : (
                <Copy color="#6EACDA" />
              )}
            </Button>
            <Button variant="ghost" onClick={handleDownloadQR}>
              <Download color="green" />
            </Button>
            <Button variant="ghost" onClick={() => fnDelete()}>
              {loadingDelete ? (
                <ClipLoader size={21} color="#36d7b7" />
              ) : (
                <Trash color="#FF204E" />
              )}
            </Button>
          </div>
          <img
            src={urlInfoData?.qr}
            alt="qr-code"
            className="w-full self-center p-1 object-contain sm:self-start ring ring-blue-500"
          />
        </div>

        <div className="sm:w-3/5">
          <Card>
            <CardHeader>
              <CardTitle className="text-4xl font-extrabold">
                Analytics
              </CardTitle>
            </CardHeader>

            {analyticsOfUrlData && analyticsOfUrlData?.length ? (
              <CardContent className="flex flex-col gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Clicks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{analyticsOfUrlData?.length}</p>
                  </CardContent>
                </Card>

                <CardTitle>Locations</CardTitle>
                <LocationAnalysis stats={analyticsOfUrlData} />
                <CardTitle>Device Info</CardTitle>
                <DeviceAnalysis stats={analyticsOfUrlData} />
              </CardContent>
            ) : (
              <CardContent>
                {loadingAnalyticsOfUrl ? (
                  <div className="flex items-center justify-center text-2xl gap-2">
                    <ClipLoader size={22} color="#36d7b7" /> Loading please
                    wait...
                  </div>
                ) : (
                  "No Statistics Available Yet!"
                )}
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default Analytics;
