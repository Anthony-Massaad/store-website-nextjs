"use client";

import { CartItems, ProductsData } from "@/interface/globalInterfaces";
import { FC, ReactNode, createContext, useState } from "react";

interface CartProps {
  cartItems: CartItems;
  addItemToCart: (item: ProductsData) => void;
  incrementCartItem: (itemId: number) => void;
  decrementCartItem: (itemId: number) => void;
  removeItem: (itemId: number) => void;
}

interface Props {
  children: ReactNode;
}

export const CartContext = createContext<CartProps>({} as CartProps);

const CartProvider: FC<Props> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItems>({});

  const addItemToCart = (item: ProductsData): void => {
    // item should never be in cart already
    if (cartItems[item.id]) {
      return;
    }

    setCartItems((prevItems) => ({
      ...prevItems,
      [item.id]: {
        ...item,
        quantity: 1,
      },
    }));
  };

  const incrementCartItem = (itemId: number): void => {
    setCartItems((prevItems) => ({
      ...prevItems,
      [itemId]: {
        ...prevItems[itemId],
        quantity: prevItems[itemId].quantity + 1,
      },
    }));
  };

  const decrementCartItem = (itemId: number): void => {
    const copyCartItems = { ...cartItems };
    if (copyCartItems[itemId].quantity - 1 > 0) {
      copyCartItems[itemId].quantity--;
    } else {
      delete copyCartItems[itemId];
    }
    setCartItems(copyCartItems);
  };

  const removeItem = (itemId: number): void => {
    const copyCartItems = { ...cartItems };
    delete copyCartItems[itemId];
    setCartItems(copyCartItems);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItemToCart,
        incrementCartItem,
        decrementCartItem,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
