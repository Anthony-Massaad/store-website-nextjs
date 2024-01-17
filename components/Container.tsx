"use client";

import React, { FC, ReactNode, useMemo } from "react";

interface Props {
  children: ReactNode;
  classNames?: string;
  contentContainer?: boolean;
}

const Container: FC<Props> = ({ children, classNames, contentContainer }) => {
  const className = useMemo(() => {
    return `container ${classNames && classNames} ${
      contentContainer && "mt-8"
    }`;
  }, [classNames, contentContainer]);

  return <div className={className}>{children}</div>;
};

export default Container;
