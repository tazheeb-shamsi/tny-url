import { UrlState } from "@/context/context";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import ErrorHandler from "./ErrorHandler";
import { Card } from "./ui/card";
import { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { useFetch } from "@/hooks/useFetch";
import { QRCode } from "react-qrcode-logo";
import { ClipLoader } from "react-spinners";
import { createUrl } from "@/db/urlsApi";

const CreateLink = () => {
  const { user } = UrlState();
  const navigate = useNavigate();
  const ref = useRef();

  let [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    longUrl: longLink ? longLink : "",
    customUrl: "",
  });

  const schema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    longUrl: Yup.string()
      .url("Must be a valid URL")
      .required("Long URL is required"),
    customUrl: Yup.string(),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const {
    data,
    loading,
    error,
    fn: CreateUrlFunction,
  } = useFetch(createUrl, { ...formData, userId: user?.id });

  const createNewLink = async () => {
    setErrors({});
    try {
      await schema.validate(formData, { abortEarly: false });
      const canvas = ref.current.canvasRef.current;
      const blob = await new Promise((resolve) => canvas.toBlob(resolve));

      await CreateUrlFunction(blob);
    } catch (e) {
      const newErrors = {};

      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
    }
    console.log("CLICKED");
  };

  useEffect(() => {
    if (error === null && data) {
      navigate(`/link/${data[0].id}`);
    }
  }, [error, data]);

  return (
    <Dialog
      defaultOpen={longLink}
      onOpenChange={(res) => {
        if (!res) setSearchParams({});
      }}
    >
      <DialogTrigger>Create New Link</DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">Create New</DialogTitle>
        </DialogHeader>

        {formData.longUrl && (
          <div className="flex items-center justify-center object-contain p-2">
            <QRCode
              value={formData?.longUrl}
              size={250}
              ref={ref}
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>
        )}

        <Input
          type="text"
          name="title"
          onChange={handleInputChange}
          value={formData.title}
          placeholder="Short Link's Title"
        />
        {errors.title && <ErrorHandler message={errors.title} />}

        <Input
          type="text"
          name="longUrl"
          onChange={handleInputChange}
          value={formData.longUrl}
          placeholder="Enter Your Looong URL"
        />
        {errors.longUrl && <ErrorHandler message={errors.longUrl} />}

        <div className="flex  items-center gap-2">
          <Card className="p-2">tny.in</Card>
          <Input
            type="text"
            name="customUrl"
            onChange={handleInputChange}
            value={formData.customUrl}
            placeholder="Custom Link (Optional)"
          />
        </div>
        {errors.customUrl && <ErrorHandler message={errors.customUrl} />}

        <DialogFooter className="sm:justify-start">
          <Button
            variant="destructive"
            onClick={createNewLink}
            disabled={loading}
          >
            {loading ? <ClipLoader size={21} color="#36d7b7" /> : "Create"}
          </Button>

          {error && <ErrorHandler message={error.message} />}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLink;
