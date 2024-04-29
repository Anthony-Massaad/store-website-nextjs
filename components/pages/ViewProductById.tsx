"use client";

import Container from "@/components/Container";
import { useParams } from "next/navigation";
import React, { FC, ReactElement, useEffect, useState } from "react";
import axios from "axios";
import { Rating } from "primereact/rating";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";
import { ProductsData } from "@/interface/globalInterfaces";
import CarouselProduct from "@/components/CarouselProducts";

const ViewProductByIdPage: FC = () => {
  const { id } = useParams();

  const [product, setProduct] = useState<ProductsData | null>(null);

  useEffect(() => {
    (async () => {
      axios
        .get(`/api/v1/getProduct/${id}`, {
          headers: { "Content-Type": "application/json" },
        })
        .then((res) => {
          if (res.status === 200) {
            setProduct(res.data);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    })();
  }, [id]);

  const displayProduct = (displayProduct: ProductsData): ReactElement => {
    return (
      <>
        <div className="flex gap-3">
          <img
            src={displayProduct.image}
            alt={`${displayProduct.name}`}
            className="w-25rem"
          />
          <div>
            <div className="flex align-items-center gap-2 mb-5">
              <i className="pi pi-tag"></i>
              <span className="font-semibold">{displayProduct.category}</span>
            </div>
            <h2 className="mb-3 text-4xl">{displayProduct.name}</h2>
            <div className="flex mb-2 gap-2">
              <span className="text-800 font-bold">
                {displayProduct.rating}
              </span>
              <Rating value={displayProduct.rating} cancel={false}></Rating>
              <span className="text-800 font-bold">
                ({displayProduct.numOfPeopleRated} ratings)
              </span>
            </div>
            <p className="text-2xl">${displayProduct.price}</p>
            <Divider className="my-3" />
            <div className="mb-2">
              <strong>Description:</strong>
              <p className="mt-1 line-height-3">{displayProduct.description}</p>
            </div>
            <p className="mb-3">
              <strong>Quantity: </strong>
              {displayProduct.quantity}
            </p>
            {displayProduct.quantity > 0 ? (
              <Button
                icon="pi pi-shopping-cart"
                className="p-button-rounded gap-2"
                raised
              >
                Add to Cart
              </Button>
            ) : (
              <Tag
                className="p-1"
                value={"OUTOFSTOCK"}
                severity={"danger"}
              ></Tag>
            )}
          </div>
        </div>
      </>
    );
  };

  const displayProductLoading = (): ReactElement => {
    return (
      <>
        <div className="flex gap-3">
          <Skeleton className="w-25rem h-25rem" />
          <div>
            <div className="flex align-items-center gap-2 mb-5">
              <Skeleton className="w-6rem border-round h-1rem" />
              <Skeleton className="w-3rem border-round h-1rem" />
            </div>
            <Skeleton className="w-full border-round h-1rem mb-3" />
            <div className="flex mb-2 gap-2">
              <Skeleton className="w-6rem border-round h-1rem" />
              <Skeleton className="w-3rem border-round h-1rem" />
              <Skeleton className="w-3rem border-round h-1rem" />
            </div>
            <Skeleton className="w-3rem border-round h-1rem" />
            <Divider className="my-3" />
            <div className="mb-2">
              <strong>Description:</strong>
              <Skeleton className="w-full border-round h-1rem mt-2" />
            </div>
            <div className="mb-3 flex gap-2">
              <strong>Quantity: </strong>
              <Skeleton className="w-3rem border-round h-1rem mt-1" />
            </div>
            <Skeleton className="w-5rem border-round h-2rem" />
          </div>
        </div>
      </>
    );
  };

  return (
    <Container contentContainer>
      {product ? displayProduct(product) : displayProductLoading()}
      <Divider className="my-3" />
      <Card className="mb-4">
        <h2 className="p-4">Related Items</h2>
        <CarouselProduct itemCategory={product?.category} />
      </Card>
    </Container>
  );
};

export default ViewProductByIdPage;
