import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { magic } from "../lib/magic";
import Loader from "./Loader/Loader";

export default function Layout({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getLogin = async () => {
      const isLoggedIn = await magic.user.isLoggedIn();
      if (!isLoggedIn) {
        router.push("/login");
      }
    };
    getLogin();
  }, []);

  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };

    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return isLoading ? (
    <>
      <Loader />
    </>
  ) : (
    <>{children}</>
  );
}
