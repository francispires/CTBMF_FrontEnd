import {Spinner} from "@nextui-org/react";

export const PageLoader = () => {
  return (
    <div className="flex w-full h-[calc(100vh-64px)] items-center justify-center">
        <Spinner size="lg" className="flex items-center" />
    </div>
  );
};
