"use client";

import { CartItems, ProductsData } from "@/interface/globalInterfaces";
import axios from "axios";
import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { SessionContext } from "./SessionProvider";
import { ToastContext } from "./ToastProvider";

interface CartProps {
  cartItems: CartItems;
  addItemToCart: (item: ProductsData) => Promise<void>;
  incrementCartItem: (itemId: number) => Promise<void>;
  decrementCartItem: (itemId: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
}

interface Props {
  children: ReactNode;
}

export const CartContext = createContext<CartProps>({} as CartProps);

const CartProvider: FC<Props> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItems>({});
  const { userData } = useContext(SessionContext);
  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    if (userData) {
      (async () => {
        await axios
          .get(`/api/v1/cartFunc/getUserItems/${userData.id}`)
          .then((res) => {
            if (res.status === 200) {
              setCartItems(res.data);
            }
          })
          .catch((err) => {
            console.error(err);
            showToast("error", "Fetching cart items error");
          });
      })();
    }
  }, [userData]);

  const updateItem = async (
    productId: number,
    operation: "increment" | "decrement" | "remove"
  ) => {
    if (!userData?.id) {
      return;
    }

    const data = {
      productId: productId,
      operation: operation,
      userId: userData.id,
    };
    await axios
      .post("/api/v1/cartFunc/updateItem", JSON.stringify(data))
      .then((res) => {
        if (res.status === 200) {
          showToast("success", "Updated Item");
        }
      })
      .catch((err) => {
        console.error(err);
        showToast("error", "Something went wrong updating item in cart");
      });
  };

  const addItemToCart = async (item: ProductsData): Promise<void> => {
    // item should never be in cart already
    if (cartItems[item.id]) {
      return;
    }

    if (!userData?.id) {
      return;
    }

    const data = {
      productId: item.id,
      userId: userData.id,
    };
    await axios
      .post("/api/v1/cartFunc/addToCart", JSON.stringify(data))
      .then((res) => {
        if (res.status === 200) {
          showToast("success", "Added To Cart");
        }
      })
      .catch((err) => {
        showToast("error", "Something went wrong adding to cart");
      });

    setCartItems((prevItems) => ({
      ...prevItems,
      [item.id]: {
        ...item,
        quantity: 1,
      },
    }));
  };

  const incrementCartItem = async (itemId: number): Promise<void> => {
    setCartItems((prevItems) => ({
      ...prevItems,
      [itemId]: {
        ...prevItems[itemId],
        quantity: prevItems[itemId].quantity + 1,
      },
    }));

    await updateItem(itemId, "increment");
  };

  const decrementCartItem = async (itemId: number): Promise<void> => {
    const copyCartItems = { ...cartItems };
    if (copyCartItems[itemId].quantity - 1 > 0) {
      copyCartItems[itemId].quantity--;
    } else {
      delete copyCartItems[itemId];
    }
    setCartItems(copyCartItems);
    await updateItem(itemId, "decrement");
  };

  const removeItem = async (itemId: number): Promise<void> => {
    const copyCartItems = { ...cartItems };
    delete copyCartItems[itemId];
    setCartItems(copyCartItems);
    await updateItem(itemId, "remove");
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
