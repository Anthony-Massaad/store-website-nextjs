"use client";

import Container from "@/components/Container";
import ProductsDataView from "@/components/ProductsDataView";
import { useParams, useRouter } from "next/navigation";
import { Card } from "primereact/card";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { FC, useEffect, useState } from "react";

interface CategoryDropdownValues {
  name: string;
  code: string;
}

const ViewProductByCategory: FC = () => {
  const [selectedDropdown, setSelectedDropdown] =
    useState<CategoryDropdownValues | null>(null);
  const { category } = useParams();
  const navigate = useRouter();

  const categories: CategoryDropdownValues[] = [
    { name: "Men's clothing", code: "Men's clothing" },
    { name: "Women's clothing", code: "Women's clothing" },
    { name: "Electronics", code: "Electronics" },
    { name: "Jewelery", code: "Jewelery" },
  ];

  useEffect(() => {
    if (!category) {
      navigate.push("/");
    } else {
      console.log(decodeURIComponent(category as string));
      setSelectedDropdown({
        name: decodeURIComponent(category as string),
        code: decodeURIComponent(category as string),
      });
    }
  }, [category]);

  return (
    <Container contentContainer>
      <Dropdown
        value={selectedDropdown}
        onChange={(e: DropdownChangeEvent) => {
          if (e.value !== selectedDropdown) {
            navigate.push(`/viewProductCategory/${e.value.name}`);
          }
        }}
        options={categories}
        optionLabel="name"
        placeholder="Select a Category"
        className="p-2 mb-4 border-1 max-w-15rem w-full"
      />
      <Card className="mb-4">
        <h2 className="p-4">
          Category: {decodeURIComponent(category as string)}
        </h2>
        <ProductsDataView category={(category as string).toLowerCase()} />
      </Card>
    </Container>
  );
};

export default ViewProductByCategory;
