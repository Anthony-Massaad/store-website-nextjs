"use client";

import React, { FC, ReactElement, useContext, useEffect } from "react";
import { Button } from "primereact/button";
import Container from "./Container";
import { MenuItem } from "primereact/menuitem";
import { Menubar } from "primereact/menubar";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useSession from "@/hooks/useSession";
import { UserProviderContext } from "@/providers/UserProvider";

const Header: FC = () => {
  const navigate = useRouter();

  const route = (to: string) => navigate.push(to);
  const { token } = useSession();
  const { userData } = useContext(UserProviderContext);

  useEffect(() => {
    console.log("header() userData: ", userData);
  }, [userData]);

  const items: MenuItem[] = [
    {
      icon: "pi pi-home",
      label: "Home",
      command: () => route("/"),
      className: "text-md p-1 home-btn",
    },
    {
      label: "Category",
      className: "text-md p-1",
      items: [
        {
          label: "Men's clothing",
          className: "text-md p-1",
          command: () => route("/viewProductCategory/men's clothing"),
        },
        {
          label: "Women's clothing",
          className: "text-md p-1",
          command: () => route("/viewProductCategory/Women's clothing"),
        },
        {
          label: "Electronics",
          className: "text-md p-1",
          command: () => route("/viewProductCategory/electronics"),
        },
        {
          label: "Jewelery",
          className: "text-md p-1",
          command: () => route("/viewProductCategory/jewelery"),
        },
      ],
    },
  ];

  const end = (): ReactElement => {
    return (
      <div className="flex gap-2">
        {token && userData ? (
          <p>{userData.username}</p>
        ) : (
          <>
            <Link href="/login">
              <Button
                icon="pi pi-sign-in"
                className="border-round gap-2 justify-content-between"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button
                className="border-round gap-2 justify-content-between"
                outlined
              >
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>
    );
  };

  return (
    <header className="header-bar shadow-1 surface-overlay border-noround fixed top-0 w-full z-5 px-5">
      <Container>
        <Menubar
          model={items}
          end={end}
          className="h-full flex justify-content-between surface-overlay"
        />
      </Container>
    </header>
  );
};

export default Header;
