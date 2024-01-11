import React from "react";
import { PageLayout } from "../components/page-layout.jsx";

export const NotFoundPage = () => {
  return (
    <PageLayout>
      <div className="content-layout">
        <h1 id="page-title" className="content__title">
          Não encontrado
        </h1>
      </div>
    </PageLayout>
  );
};
