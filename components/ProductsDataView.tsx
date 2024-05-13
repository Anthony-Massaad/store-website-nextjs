"use client";

import axios from "axios";
import React, { FC, ReactElement, useEffect, useState } from "react";
import { ProductsData } from "../interface/globalInterfaces";
import { isEmpty } from "lodash";
import { Tag } from "primereact/tag";
import { Rating } from "primereact/rating";
import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import { DataView } from "primereact/dataview";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";

interface Props {
  category?: string;
}

const ProductsDataView: FC<Props> = ({ category }) => {
  const [products, setProducts] = useState<ProductsData[]>([]);
  useEffect(() => {
    if (!category) return;
    if (category === "all") {
      // all
      (async (): Promise<void> => {
        await axios
          .get("/api/v1/getProducts", {
            headers: {
              "Content-type": "application/json",
            },
          })
          .then((res) => {
            if (res.status === 200) {
              setProducts(res.data);
            } else {
              console.error(`Got status ${res.status}: ${res.data}`);
            }
          })
          .catch((err) => {
            console.error(err);
          });
      })();
    } else {
      // specific
      (async (): Promise<void> => {
        await axios
          .get(`/api/v1/getProducts/${category}`, {
            headers: {
              "Content-type": "application/json",
            },
          })
          .then((res) => {
            if (res.status === 200) {
              setProducts(res.data);
            } else {
              console.error(`Got status ${res.status}: ${res.data}`);
            }
          })
          .catch((err) => {
            console.error(err);
          });
      })();
    }
  }, [category]);

  const allProductsGridItem = (product: ProductsData): ReactElement => {
    return (
      <div className="col-12 sm:col-6 xl:col-4 p-2 relative">
        <Link
          href={`/viewProduct/${product.id}`}
          className="flex flex-column p-4 border-1 surface-border surface-card border-round block product hover:shadow-2 z-2 relative"
        >
          <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <div className="flex align-items-center gap-2">
              <i className="pi pi-tag"></i>
              <span className="font-semibold">{product.category}</span>
            </div>
            <Tag
              className="p-1"
              value={product.quantity > 0 ? "INSTOCK" : "OUTOFSTOCK"}
              severity={"success"}
            ></Tag>
          </div>
          <div className="flex flex-column align-items-center gap-3 py-5">
            <img
              className="shadow-2 border-round"
              src={product.image}
              alt={product.name}
            />
            <div className="product-title text-2xl font-bold text-overflow-ellipsis white-space-nowrap overflow-hidden">
              {product.name}
            </div>
            <div className="flex gap-2">
              <Rating value={product.rating} readOnly cancel={false}></Rating>
              <span className="text-xl font-semibold">
                ({product.numOfPeopleRated})
              </span>
            </div>
          </div>
          <div className="flex align-items-center justify-content-between mt-auto">
            <span className="text-2xl font-semibold">${product.price}</span>
            <AddToCartButton item={product} disabled={product.quantity === 0} />
          </div>
        </Link>
      </div>
    );
  };

  const allProductsGridItemLoading = (): ReactElement => {
    return (
      <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2">
        <div className="p-4 border-1 surface-border surface-card border-round">
          <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <Skeleton className="w-6rem border-round h-1rem" />
            <Skeleton className="w-3rem border-round h-1rem" />
          </div>
          <div className="flex flex-column align-items-center gap-3 py-5">
            <Skeleton className="w-9 shadow-2 border-round h-10rem" />
            <Skeleton className="w-8rem border-round h-2rem" />
            <Skeleton className="w-6rem border-round h-1rem" />
          </div>
          <div className="flex align-items-center justify-content-between">
            <Skeleton className="w-4rem border-round h-2rem" />
            <Skeleton shape="circle" className="w-3rem h-3rem" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {isEmpty(products) ? (
        <DataView
          value={Array.from({ length: 12 })}
          itemTemplate={allProductsGridItemLoading}
          layout={"grid"}
        />
      ) : (
        <DataView
          value={products}
          itemTemplate={allProductsGridItem}
          layout={"grid"}
        />
      )}
    </>
  );
};

export default ProductsDataView;
