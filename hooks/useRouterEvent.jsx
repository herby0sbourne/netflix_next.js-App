import { useEffect } from "react";

const useRouterEvent = (setIsLoading, router) => {
  const handleComplete = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router.events]);

  return handleComplete;
};

export default useRouterEvent;
