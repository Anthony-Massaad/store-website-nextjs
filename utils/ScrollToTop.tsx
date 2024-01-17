"use client";

import React, { FC, ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface Props {
  children: ReactNode;
}

const ScrollToTop: FC<Props> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return <>{children}</>;
};

export default ScrollToTop;
