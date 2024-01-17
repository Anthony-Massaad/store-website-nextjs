import { UserData } from "@/interface/globalInterfaces";
import { useSessionStorage } from "primereact/hooks";
import { useState } from "react";

const useSession = () => {
  const [token, setToken] = useSessionStorage<string | null>(null, "token");

  return {
    token,
    setToken,
  };
};

export default useSession;
