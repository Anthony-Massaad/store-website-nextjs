"use client";

import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from "react";
import { debounce, isEmpty, map } from "lodash";
import axios from "axios";
import { ProductsData } from "@/interface/globalInterfaces";
import { ToastContext } from "@/providers/ToastProvider";
import Link from "next/link";
import { Divider } from "primereact/divider";
import { ProgressSpinner } from "primereact/progressspinner";

interface Props {
  searchVisible: boolean;
  setSearchVisible: Dispatch<SetStateAction<boolean>>;
}

const SearchBar: FC<Props> = ({ searchVisible, setSearchVisible }) => {
  const [searchInput, setSearchInput] = useState("");
  const [preSearchResults, setPreSearchResults] = useState<ProductsData[]>([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useContext(ToastContext);

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      setLoading(true);
      if (query.length > 3) {
        await axios
          .get(`/api/v1/search`, {
            params: {
              query: query,
              operation: "limit",
            },
          })
          .then((res) => {
            if (res.status === 200) {
              setPreSearchResults(res.data);
            }
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching search results:", error);
            showToast("error", "Error search products");
            setLoading(false);
          });
      } else {
        setPreSearchResults([]);
        setLoading(false);
      }
    }, 200),
    []
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };

  return (
    <Dialog
      visible={searchVisible}
      modal
      position="center"
      closable={true}
      contentStyle={{ padding: "1rem", overflow: "unset" }}
      headerStyle={{ padding: "0" }}
      draggable={false}
      style={{ width: "50rem" }}
      onHide={() => {
        setSearchVisible(false);
        setSearchInput("");
        setPreSearchResults([]);
      }}
      className="relative"
    >
      <div className="flex gap-4 justify-content-center">
        <div className="w-full relative">
          <InputText
            placeholder="Search"
            value={searchInput}
            onChange={handleSearchChange}
            className="border-round w-full"
          />
          {!isEmpty(preSearchResults) && (
            <ul
              className={`${"absolute w-full left-0 top-100 bg-white border-3 border-round surface-border block"}`}
            >
              {map(preSearchResults, (item, idx) => (
                <li key={idx}>
                  <Link
                    href={`/viewProduct/${item.id}`}
                    onClick={() => {
                      setSearchVisible(false);
                      setSearchInput("");
                      setPreSearchResults([]);
                    }}
                    className="block hover:surface-hover p-2 text-color font-bold cursor-pointer"
                  >
                    <p>{item.name}</p>
                  </Link>
                  {idx !== preSearchResults.length && (
                    <Divider className="m-0" />
                  )}
                </li>
              ))}
            </ul>
          )}
          {loading && (
            <ul className="absolute w-full left-0 top-100 bg-white border-3 border-round surface-border block">
              <li className="flex justify-content-center p-2">
                <ProgressSpinner />
              </li>
            </ul>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default SearchBar;
