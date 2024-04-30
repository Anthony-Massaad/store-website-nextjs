"use client";

import { UserData } from "@/interface/globalInterfaces";
import { atom, useAtom } from "jotai";
import { FC, ReactNode, createContext, useEffect } from "react";

interface Props {
  children: ReactNode;
  session: any;
}

interface ContextProps {
  userData?: UserData;
}

export const SessionContext = createContext<ContextProps>({} as ContextProps);

const userDataAtom = atom<UserData | undefined>(undefined);

const SessionProvider: FC<Props> = ({ children, session }) => {
  const [userData, setUserData] = useAtom<UserData | undefined>(userDataAtom);

  useEffect(() => {
    if (session) {
      console.log("Session Changed! ", session);
      setUserData({
        email: session.user.email,
        username: session.user.username,
        id: session.user.id,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        address: session.user.address,
      });
    }
  }, [session]);

  return (
    <SessionContext.Provider value={{ userData }}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider;
