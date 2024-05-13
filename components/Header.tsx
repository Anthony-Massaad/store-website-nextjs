"use client";

import React, {
  FC,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from "react";
import { Button } from "primereact/button";
import Container from "./Container";
import { MenuItem } from "primereact/menuitem";
import { Menubar } from "primereact/menubar";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { SessionContext } from "@/providers/SessionProvider";
import { map } from "lodash";
import { logoutFunc } from "@/lib/utils";
import { Divider } from "primereact/divider";
import SideBarCartList from "./SideBarCartList";

interface UserSigninOptions {
  icon?: string;
  label: string;
  command: () => void;
}

const Header: FC = () => {
  const navigate = useRouter();
  const route = (to: string) => navigate.push(to);
  const { userData } = useContext(SessionContext);
  const [userOptionsActive, setUserOptionsActive] = useState(false);
  const [sideBarVisibleRight, setSideBarVisibleRight] = useState(false);
  const pathname = usePathname();

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

  const userSignInOptions: UserSigninOptions[] = [
    {
      icon: "pi pi-user",
      label: "Profile",
      command: () => {
        route(`/profile/${userData?.id}`);
        setUserOptionsActive(false);
      },
    },
    {
      icon: "pi pi-sign-out",
      label: "Logout",
      command: () => {
        logoutFunc();
        setUserOptionsActive(false);
        navigate.push(pathname);
      },
    },
  ];

  useEffect(() => {
    // use effect to handle clicking anywhere BUT the username or ul, close the ul
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (userOptionsActive && !target.closest(".user-menu-options")) {
        setUserOptionsActive(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [userOptionsActive]);

  const end = (): ReactElement => {
    return (
      <div className="flex gap-2">
        {userData ? (
          <div className="flex gap-2 align-items-center justify-items-center">
            <Button
              icon="pi pi-shopping-cart"
              className="p-button-rounded"
              onClick={() => {
                setSideBarVisibleRight(true);
              }}
            ></Button>
            <div className="relative user-menu-options">
              <div
                role="button"
                tabIndex={-1}
                className="focus:border-blue-200 transition-ease-in-out transition-duration-100 border-transparent select-none flex gap-2 p-3 border-3 border-round font-semibold cursor-pointer"
                onClick={() => setUserOptionsActive((prev) => !prev)}
              >
                <p>{userData.username}</p>
                <i className="pi pi-angle-down"></i>
              </div>
              <ul
                className={`${"absolute w-full left-0 top-100 bg-white border-3 border-round surface-border"} ${
                  userOptionsActive ? "block" : "hidden"
                }`}
              >
                {map(userSignInOptions, (item, idx) => (
                  <li
                    key={idx}
                    onClick={() => item.command()}
                    className="hover:surface-hover cursor-pointer"
                  >
                    <div className="flex gap-2 p-3">
                      {item.icon && <i className={item.icon}></i>}
                      <p>{item.label}</p>
                    </div>
                    {idx !== userSignInOptions.length && (
                      <Divider className="m-0" />
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <SideBarCartList
              setSideBarVisibleRight={setSideBarVisibleRight}
              sideBarVisibleRight={sideBarVisibleRight}
            />
          </div>
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
    <header className="header-bar shadow-1 surface-overlay border-noround fixed top-0 w-full z-5 px-5 block">
      <Container>
        <Menubar
          model={items}
          end={end}
          className="h-full flex justify-content-between surface-overlay block border-0 p-0 m-0"
        />
      </Container>
    </header>
  );
};

export default Header;
