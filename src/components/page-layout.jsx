import React from "react";
import { PageFooter } from "./page-footer.jsx";

export const PageLayout = ({ children }) => {
  return (
    <div className="">
      <div className="">{children}</div>
      <PageFooter />
    </div>
  );
};
