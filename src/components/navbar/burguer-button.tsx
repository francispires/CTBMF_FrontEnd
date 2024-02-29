import { useSidebarContext } from "../layout/layout-context";
import { StyledBurgerButton } from "./navbar.styles";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const BurguerButton = () => {
  const {collapsed, setCollapsed } = useSidebarContext();

  return (
    <div
      className={StyledBurgerButton()}
      // open={collapsed}
      onClick={setCollapsed}
    >
      <FontAwesomeIcon icon={collapsed?faChevronLeft:faChevronRight} />
    </div>
  );
};
