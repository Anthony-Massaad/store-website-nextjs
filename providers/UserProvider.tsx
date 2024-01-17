"use client";

import { UserData } from "@/interface/globalInterfaces";
import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";

interface UserProviderProps {
  userData: UserData | null;
  setUserData: Dispatch<SetStateAction<UserData | null>>;
}

export const UserProviderContext = createContext({} as UserProviderProps);

interface Props {
  children: ReactNode;
}

const UserProvider: FC<Props> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);

  return (
    <UserProviderContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserProviderContext.Provider>
  );
};

export default UserProvider;
