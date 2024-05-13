"use client";

import React, { FC, ReactElement, useEffect, useState } from "react";
import { ProductsData } from "../interface/globalInterfaces";
import axios from "axios";
import { Carousel, CarouselResponsiveOption } from "primereact/carousel";
import { Skeleton } from "primereact/skeleton";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { isEmpty } from "lodash";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";

interface Props {
  itemCategory?: string;
}

const CarouselProduct: FC<Props> = ({ itemCategory }) => {
  const [carouselProducts, setCarouselProducts] = useState<ProductsData[]>([]);

  const responsiveOptions: CarouselResponsiveOption[] = [
    {
      breakpoint: "1199px",
      numVisible: 4,
      numScroll: 1,
    },
    {
      breakpoint: "991px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "767px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "500px",
      numVisible: 1,
      numScroll: 1,
    },
  ];

  useEffect(() => {
    if (!itemCategory) return;
    if (itemCategory === "topRated") {
      (async (): Promise<void> => {
        axios
          .get("/api/v1/getProducts/topRated", {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            if (res.status === 200) {
              setCarouselProducts(res.data);
            }
          })
          .catch((err) => {
            console.error(err);
          });
      })();
    } else {
      (async (): Promise<void> => {
        axios
          .get(`/api/v1/getProducts/${itemCategory}`, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            if (res.status === 200) {
              setCarouselProducts(res.data);
            }
          })
          .catch((err) => {
            console.error(err);
          });
      })();
    }
  }, [itemCategory]);

  const handleCartButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    event.preventDefault();
  };

  const carouselProductsLayoutLoading = (): ReactElement => {
    return (
      <div className=" flex flex-column gap-2 border-1 surface-border surface-card border-round m-2 text-center p-3">
        <div className="flex align-items-center gap-2">
          <Skeleton className="w-6rem border-round h-1rem" />
        </div>
        <div className="flex flex-column align-items-center">
          <Skeleton className="w-9 shadow-2 border-round h-10rem" />
        </div>
        <div className="flex flex-column align-items-center gap-2">
          <Skeleton className="w-8rem border-round h-2rem" />
          <Skeleton className="w-8rem border-round h-2rem" />
          <Skeleton className="w-8rem border-round h-2rem" />
        </div>
        <div className="mt-auto flex flex-column align-items-center">
          <Skeleton className="w-9 border-round h-2rem p-button-rounded" />
        </div>
      </div>
    );
  };

  const carouselProductsLayout = (product: ProductsData): ReactElement => {
    return (
      <Link
        href={`/viewProduct/${product.id}`}
        className=" flex flex-column gap-2 border-1 surface-border surface-card border-round m-2 text-center p-3 block product hover:shadow-2"
      >
        <div className="flex align-items-center gap-2">
          <i className="pi pi-tag"></i>
          <span className="font-semibold">{product.category}</span>
        </div>
        <div className="">
          <img src={product.image} alt={product.name} className="shadow-2" />
        </div>
        <h4 className="product-title">{product.name}</h4>
        <h6 className="text-lg">${product.price.toFixed(2)}</h6>
        <Tag
          value={product.quantity > 0 ? "INSTOCK" : "OUTOFSTOCK"}
          severity={"success"}
          className="p-1 w-5 m-auto"
        ></Tag>
        <div className="mt-auto flex align-content-center justify-content-center">
          <AddToCartButton
            item={product}
            disabled={product.quantity === 0}
            text="Add to Cart"
          />
        </div>
      </Link>
    );
  };

  return (
    <>
      {isEmpty(carouselProducts) ? (
        <Carousel
          value={Array.from({ length: 5 })}
          numVisible={5}
          numScroll={1}
          responsiveOptions={responsiveOptions}
          circular
          showIndicators={false}
          showNavigators={false}
          itemTemplate={carouselProductsLayoutLoading}
        />
      ) : (
        <Carousel
          value={carouselProducts}
          numVisible={5}
          numScroll={1}
          responsiveOptions={responsiveOptions}
          circular
          showIndicators={false}
          itemTemplate={carouselProductsLayout}
        />
      )}
    </>
  );
};

export default CarouselProduct;
