"use client";

import { UserData } from "@/interface/globalInterfaces";
import { atom, useAtom } from "jotai";
import { FC, ReactNode, createContext, useEffect } from "react";

interface Props {
  children: ReactNode;
  session: {
    decrypted: any;
    token: string;
  } | null;
}

interface ContextProps {
  userData?: UserData;
  sessionToken?: string;
}

export const SessionContext = createContext<ContextProps>({} as ContextProps);

const userDataAtom = atom<UserData | undefined>(undefined);
const sessionTokenAtom = atom<string | undefined>(undefined);

const SessionProvider: FC<Props> = ({ children, session }) => {
  const [userData, setUserData] = useAtom<UserData | undefined>(userDataAtom);
  const [sessionToken, setSessionToken] = useAtom<string | undefined>(
    sessionTokenAtom
  );

  useEffect(() => {
    if (session) {
      const data = session.decrypted;
      setUserData({
        email: data.user.email,
        username: data.user.username,
        id: data.user.id,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        address: data.user.address,
      });
      setSessionToken(session.token);
    }
  }, [session]);

  return (
    <SessionContext.Provider value={{ userData, sessionToken }}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider;
