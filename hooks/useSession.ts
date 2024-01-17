import { useLocalStorage } from "primereact/hooks";

const useSession = () => {
  const [token, setToken] = useLocalStorage<string | null>(null, "token");

  return {
    token,
    setToken,
  };
};

export default useSession;
