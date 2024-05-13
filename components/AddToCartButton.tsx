"use client";

import { ProductsData } from "@/interface/globalInterfaces";
import { CartContext } from "@/providers/CartProvider";
import { SessionContext } from "@/providers/SessionProvider";
import { ToastContext } from "@/providers/ToastProvider";
import { Button } from "primereact/button";
import { FC, useContext, useEffect, useMemo, useState } from "react";

interface Props {
  text?: string;
  disabled: boolean;
  outlined?: boolean;
  item: ProductsData;
}

const AddToCartButton: FC<Props> = ({
  text,
  disabled,
  item,
  outlined = false,
}) => {
  const productId = useMemo(() => {
    if (item) return item.id;
    return -1;
  }, [item]);
  const { userData, sessionToken } = useContext(SessionContext);
  const { showToast } = useContext(ToastContext);
  const { cartItems, addItemToCart, incrementCartItem, decrementCartItem } =
    useContext(CartContext);

  const handleCartButtonClick = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    e.preventDefault();
    if (productId === -1) {
      showToast("error", "Product Id Error", "invalid product id");
      return;
    }
    if (!userData && !sessionToken) {
      showToast("info", "Invalid Action", "Need to be signed in");
      return;
    }
    addItemToCart(item);
  };

  const incrementButton = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    if (productId === -1) {
      showToast("error", "Product Id Error", "invalid product id");
      return;
    }
    incrementCartItem(productId);
  };

  const decrementButton = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    if (productId === -1) {
      showToast("error", "Product Id Error", "invalid product id");
      return;
    }
    decrementCartItem(productId);
  };

  return !cartItems[productId] ? (
    <Button
      icon="pi pi-shopping-cart"
      className={`p-button-rounded relative z-4${text ? " gap-2" : ""}`}
      disabled={disabled}
      outlined={outlined}
      onClick={handleCartButtonClick}
    >
      {text}
    </Button>
  ) : (
    <div className="flex flex-row">
      <Button
        icon="pi pi-minus"
        className="p-button-rounded p-button-info p-button-outlined"
        onClick={decrementButton}
      />
      <span className="border-1 flex align-items-center justify-item-center px-3 mx-1">
        {cartItems[productId].quantity}
      </span>
      <Button
        icon="pi pi-plus"
        className="p-button-rounded p-button-info"
        onClick={incrementButton}
      />
    </div>
  );
};

export default AddToCartButton;
