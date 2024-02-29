import React from "react";
import { useSidebarContext } from "../layout/layout-context";
import clsx from "clsx";
import {Link} from "react-router-dom";
import useWindowSize from "../hooks/useWindowSize";


interface Props {
  title: string;
  icon: React.ReactNode;
  isActive?: boolean;
  href?: string;
}

export const SidebarItem = ({ icon, title, isActive, href = "" }: Props) => {
  const { width } = useWindowSize()
  const { collapsed, setCollapsed } = useSidebarContext();

  const handleClick = () => {
    if (width < 768) {
      setCollapsed();
    }
  };


  return (
    <Link
      to={href}
      className="text-default-900 active:bg-none max-w-full"
    >
      {!collapsed || (
          <div
              className={clsx(
                  isActive
                      ? "bg-primary-100 [&_svg_path]:fill-primary-500"
                      : "hover:bg-default-100",
                  "flex gap-2 w-full min-h-[44px] h-full items-center px-3.5 rounded-xl cursor-pointer transition-all duration-150 active:scale-[0.98]"
              )}
              onClick={handleClick}
          >
            {icon}
            <span className="text-default-900">{title}</span>
          </div>
      )}
      {collapsed || (
        <div onClick={handleClick} className={clsx(
            isActive
                ? "bg-primary-100 [&_svg_path]:fill-primary-500"
                : "hover:bg-default-100",
            "flex gap-2 w-full min-h-[44px] h-full items-center px-3.5 rounded-xl cursor-pointer transition-all duration-150 active:scale-[0.98]"
        )}>
            {icon}
        </div>
      )}
    </Link>
  );
};
