"use client";

import { CartContext } from "@/providers/CartProvider";
import { map, toNumber, values } from "lodash";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Sidebar } from "primereact/sidebar";
import { Dispatch, FC, SetStateAction, useContext, useMemo } from "react";
import AddToCartButton from "./AddToCartButton";
import { useRouter } from "next/navigation";

interface Props {
  sideBarVisibleRight: boolean;
  setSideBarVisibleRight: Dispatch<SetStateAction<boolean>>;
}

const SideBarCartList: FC<Props> = ({
  sideBarVisibleRight,
  setSideBarVisibleRight,
}) => {
  const { cartItems, removeItem } = useContext(CartContext);
  const navigate = useRouter();

  const handleLinkClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    nav: string
  ): void => {
    e.preventDefault();
    setSideBarVisibleRight(false);
    navigate.push(nav);
  };

  const subTotal = useMemo(() => {
    return values(cartItems)
      .reduce((subtotal, item) => {
        return subtotal + item.quantity * item.price;
      }, 0)
      .toFixed(2);
  }, [cartItems]);

  const tax = useMemo(() => {
    return (toNumber(subTotal) * 0.13).toFixed(2);
  }, [subTotal]);

  const total = useMemo(() => {
    return (toNumber(tax) + toNumber(subTotal)).toFixed(2);
  }, [subTotal, tax]);

  return (
    <Sidebar
      visible={sideBarVisibleRight}
      position="right"
      onHide={() => setSideBarVisibleRight(false)}
    >
      <h2>Shopping Cart</h2>
      <Divider />
      {map(values(cartItems), (item, index) => (
        <div key={index}>
          <Button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              handleLinkClick(e, `/viewProduct/${item.id}`);
            }}
            link
            className="mb-2 block text-blue-700 underline text-left p-0"
          >
            {item.name}
          </Button>
          <p className="mb-2">
            <span className="font-bold">Price:</span> ${item.price.toFixed(2)}
          </p>
          <AddToCartButton item={item} disabled={false} />
          <Button
            className="mt-2"
            severity="danger"
            onClick={() => {
              removeItem(item.id);
            }}
          >
            Remove
          </Button>
          {index !== values(cartItems).length - 1 && <Divider />}
        </div>
      ))}

      <Divider />
      <p className="mb-2">
        <span className="font-bold">Subtotal:</span> ${subTotal}
      </p>
      <p className="mb-2">
        <span className="font-bold">Tax:</span> ${tax}
      </p>
      <p className="mb-2">
        <span className="font-bold">Total:</span> ${total}
      </p>
      <Button
        className="flex column-gap-3"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          handleLinkClick(e, `/checkout`);
        }}
      >
        Checkout <i className="pi pi-arrow-right"></i>
      </Button>
    </Sidebar>
  );
};

export default SideBarCartList;
