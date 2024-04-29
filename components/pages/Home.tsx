"use client";

import { ProductsData } from "@/interface/globalInterfaces";
import axios from "axios";
import { isEmpty } from "lodash";
import Link from "next/link";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Rating } from "primereact/rating";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { FC, ReactElement, useEffect, useState } from "react";
import Container from "../Container";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import CarouselProduct from "../CarouselProducts";
import ProductsDataView from "../ProductsDataView";

export const HomePage: FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<ProductsData[]>([]);

  useEffect(() => {
    (async (): Promise<void> => {
      axios
        .get("/api/v1/getProducts/featured")
        .then((res) => {
          if (res.status === 200) {
            setFeaturedProducts(res.data);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    })();
  }, []);

  const handleCartButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    event.preventDefault();
  };

  const featuredItems = (): ReactElement => {
    const feature = (product: ProductsData): ReactElement => {
      return (
        <div className="w-full h-full relative overflow-hidden feature-panel">
          <img
            src={product.image}
            alt={product.name}
            className="w-25rem h-full absolute z-0"
          />
          <div className="ml-5  border-round flex flex-column justify-content-around align-items-center relative z-1 surface-card w-6 p-1 shadow-3 h-22rem">
            <h3 className="text-center">{product.name}</h3>
            <div className="flex gap-2">
              <Rating value={product.rating} readOnly cancel={false}></Rating>
              <span className="font-bold text-primary text-l">
                ({product.numOfPeopleRated})
              </span>
            </div>
            <h4 className="text-2xl font-bold">${product.price}</h4>
            <div className="flex flex-wrap gap-2 justify-content-around">
              <Button
                icon="pi pi-shopping-cart"
                className="p-button-rounded gap-2"
                disabled={product.quantity === 0}
                outlined
                onClick={handleCartButtonClick}
              >
                Add to Cart
              </Button>
              <Link href={`/viewProduct/${product.id}`}>
                <Button
                  icon="pi pi-arrow-right"
                  className="p-button-rounded gap-2 flex-row-reverse"
                  disabled={product.quantity === 0}
                >
                  View Product
                </Button>
              </Link>
            </div>
          </div>
        </div>
      );
    };

    const progessSpinner = (): ReactElement => {
      return (
        <div className="flex align-items-center justify-content-center w-full">
          <ProgressSpinner strokeWidth="4" />
        </div>
      );
    };

    return (
      <Splitter style={{ height: "400px" }} layout="horizontal" gutterSize={0}>
        <SplitterPanel className="border-right-1 pt-3">
          {isEmpty(featuredProducts)
            ? progessSpinner()
            : feature(featuredProducts[0])}
        </SplitterPanel>
        <SplitterPanel className="pt-3 border-left-1">
          {isEmpty(featuredProducts)
            ? progessSpinner()
            : feature(featuredProducts[1])}
        </SplitterPanel>
      </Splitter>
    );
  };

  return (
    <Container contentContainer>
      <div className="flex gap-2 mb-4 justify-content-center">
        <InputText
          placeholder="Search"
          className="border-round w-full max-w-30rem"
        />
        <Button icon="pi pi-search" className="p-button-rounded"></Button>
      </div>
      <Card className="mb-4">
        <h2 className="p-4 border-bottom-1">Featured Items</h2>
        {featuredItems()}
      </Card>
      <Card className="mb-4">
        <h2 className="p-4">Top Rated Products</h2>
        <CarouselProduct itemCategory="topRated" />
      </Card>
      <Card className="mb-4">
        <h2 className="p-4">All Products</h2>
        <ProductsDataView category="all" />
      </Card>
    </Container>
  );
};

export default HomePage;
