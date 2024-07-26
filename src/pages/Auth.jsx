import Login from "@/components/Login";
import Signup from "@/components/Signup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "react-router-dom";

const Auth = () => {
  const [searchParams] = useSearchParams();

  const longLink = searchParams.get("createNew");

  return (
    <div className="mt-24 md:mt-26 lg:mt-32 flex flex-col items-center gap-10">
      <h1 className="text-3xl font-extrabold">
        {longLink ? "Hold up! Let's login first!" : "Login / Signup"}
      </h1>

      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Signup</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Login />
        </TabsContent>
        <TabsContent value="signup">
          <Signup />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Auth;
