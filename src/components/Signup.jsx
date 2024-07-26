import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import * as Yup from "yup";
import { ClipLoader } from "react-spinners";
import { Input } from "./ui/input";

import { useEffect, useState } from "react";
import ErrorHandler from "./ErrorHandler";
import { useFetch } from "@/hooks/useFetch";
import { signup } from "@/db/authApi";
import { useNavigate, useSearchParams } from "react-router-dom";

const Signup = () => {
  const [errors, setErrors] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: null,
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };

  const {
    data,
    loading,
    error,
    fn: SignupFunction,
  } = useFetch(signup, formData);
  useEffect(() => {
    if (error === null && data) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }
  }, [error, loading]);

  const handleSignup = async () => {
    setErrors([]);
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
        profile_pic: Yup.mixed().required("Profile picture is required"),
      });

      await schema.validate(formData, { abortEarly: false });

      // api call
      await SignupFunction();
    } catch (e) {
      const newErrors = {};

      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
    }
  };
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Signup</CardTitle>
          <CardDescription>If you don&rsquo;t have an account</CardDescription>
          {error && <ErrorHandler message={error.message} />}
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Input
              name="name"
              type="text"
              placeholder="Enter your name..."
              onChange={handleInputChange}
            />
            {errors.name && <ErrorHandler message={errors.name} />}
          </div>
          <div className="space-y-1">
            <Input
              name="email"
              type="eamil"
              placeholder="Enter your email"
              onChange={handleInputChange}
            />
            {errors.email && <ErrorHandler message={errors.email} />}
          </div>
          <div className="space-y-1">
            <Input
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={handleInputChange}
            />
            {errors.password && <ErrorHandler message={errors.password} />}
          </div>
          <div className="space-y-1">
            <Input
              name="profile_pic"
              type="file"
              accept="image/*"
              onChange={handleInputChange}
            />
            {errors.profile_pic && (
              <ErrorHandler message={errors.profile_pic} />
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="px-7" onClick={handleSignup}>
            {loading ? (
              <ClipLoader size={21} color="#36d7b7" />
            ) : (
              "Create Account"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
