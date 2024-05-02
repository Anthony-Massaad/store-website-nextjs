"use client";

import Link from "next/link";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Sidebar } from "primereact/sidebar";
import { Dispatch, FC, SetStateAction } from "react";

interface Props {
  sideBarVisibleRight: boolean;
  setSideBarVisibleRight: Dispatch<SetStateAction<boolean>>;
}

const SideBarCartList: FC<Props> = ({
  sideBarVisibleRight,
  setSideBarVisibleRight,
}) => {
  return (
    <Sidebar
      visible={sideBarVisibleRight}
      position="right"
      onHide={() => setSideBarVisibleRight(false)}
    >
      <h2>Shopping Cart</h2>
      <Divider />
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </p>
      <Divider />

      <Link href="/checkout">
        <Button className="flex column-gap-3">
          Checkout <i className="pi pi-arrow-right"></i>
        </Button>
      </Link>
    </Sidebar>
  );
};

export default SideBarCartList;
