"use client";

import { atom, useAtom } from "jotai";
import { FC, ReactNode, createContext, useEffect } from "react";

interface Props {
  children: ReactNode;
  session: any;
}

interface ContextProps {
  userData?: UserData;
}

interface UserData {
  email: String;
}

export const SessionContext = createContext<ContextProps>({} as ContextProps);

const userDataAtom = atom<UserData | undefined>(undefined);

const SessionProvider: FC<Props> = ({ children, session }) => {
  const [userData, setUserData] = useAtom<UserData | undefined>(userDataAtom);

  useEffect(() => {
    if (session) {
      console.log("Session Changed! ", session);
      setUserData({ email: session.user.email });
    }
  }, [session]);

  return (
    <SessionContext.Provider value={{ userData }}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider;
