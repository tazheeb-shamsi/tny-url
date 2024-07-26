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
import { login } from "@/db/authApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UrlState } from "@/context/context";

const Login = () => {
  const [errors, setErrors] = useState([]);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const { data, loading, error, fn: LoginFunction } = useFetch(login, formData);
  const { fetchUser } = UrlState();

  useEffect(() => {
    if (error === null && data) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
      fetchUser();
    }
  }, [data, error]);

  const handleLogin = async () => {
    setErrors([]);
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
      });

      await schema.validate(formData, { abortEarly: false });

      // api call
      await LoginFunction();
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
          <CardTitle>Login</CardTitle>
          <CardDescription>If already have an account</CardDescription>
          {error && <ErrorHandler message={error.message} />}
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Input
              name="email"
              type="eamil"
              placeholder="Enter your email"
              onChange={handleInputChange}
            />
            {errors.email && <ErrorHandler message={errors.message} />}
          </div>
          <div className="space-y-1">
            <Input
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={handleInputChange}
            />
            {errors.password && <ErrorHandler message={errors.message} />}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="px-7" onClick={handleLogin}>
            {loading ? <ClipLoader size={21} color="#36d7b7" /> : "Login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
