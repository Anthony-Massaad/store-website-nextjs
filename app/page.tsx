import HomePage from "@/components/pages/Home";
import { getSession } from "@/lib/sessionUtils";

export const Home = async () => {
  const session = await getSession();
  return <HomePage session={session} />;
};

export default Home;
