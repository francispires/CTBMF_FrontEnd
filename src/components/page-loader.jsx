import React from "react";
import {Spinner} from "@nextui-org/react";

export const PageLoader = () => {
  return (
    <div className="content-stretch">
        <Spinner size="lg" className="flex items-center" />
    </div>
  );
};
