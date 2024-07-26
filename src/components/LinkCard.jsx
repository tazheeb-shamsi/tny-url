import {
  Clock,
  Copy,
  CopyCheck,
  Download,
  LinkIcon,
  Trash,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useFetch } from "@/hooks/useFetch";
import { deleteUrl } from "@/db/urlsApi";
import { ClipLoader } from "react-spinners";
import { useState } from "react";
import env from "dotenv";
env.config();
const LinkCard = ({ url, fetchUrls }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(
      `${import.meta.env.VITE_BASE_URL}/${url?.short_url}`
    );
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1300);
  };

  const handleDownloadQR = async () => {
    const imgUrl = url?.qr;
    const fileName = url?.title;

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

  const { loading: loadingDelete, fn: DeleteFunction } = useFetch(
    deleteUrl,
    url?.id
  );

  return (
    <div className="flex flex-col md:flex-row gap-5 border p-4 bg-gray-900 rounded-lg">
      <div className="flex justify-center md:justify-start">
        <img
          src={url.qr}
          alt="qr-code"
          className="h-32 object-contain ring ring-blue-500 self-start bg-white "
        />
      </div>

      <Link to={`/link/${url?.id}`} className="flex flex-col flex-1 ">
        <span className="text-3xl font-extrabold hover:underline cursor-pointer">
          {url.title}
        </span>
        <span className="text-2xl font-bold text-blue-400 hover:underline cursor-pointer">
          `{import.meta.env.VITE_BASE_URL}/
          {url?.custom_url ? url?.custom_url : url.short_url}`
        </span>
        <span className="flex items-center gap-1 hover:underline cursor-pointer">
          <LinkIcon size={16} />
          {url?.original_url}
        </span>
        <span className="flex items-center gap-2 font-extralight text-sm flex-1">
          <Clock size={16} />
          {new Date(url?.created_at).toLocaleString()}
        </span>
      </Link>
      <div className="flex gap-1 justify-center md:justify-end">
        <Button variant="ghost" onClick={handleCopyToClipboard}>
          {copied ? <CopyCheck color="#88D66C" /> : <Copy color="#6EACDA" />}
        </Button>
        <Button variant="ghost" onClick={handleDownloadQR}>
          <Download color="green" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => DeleteFunction().then(() => fetchUrls())}
        >
          {loadingDelete ? (
            <ClipLoader size={21} color="#36d7b7" />
          ) : (
            <Trash color="#FF204E" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default LinkCard;
