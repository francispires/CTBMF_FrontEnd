import { useSidebarContext } from "../layout/layout-context";
import { StyledBurgerButton } from "./navbar.styles";
import {faBarsStaggered, faChevronLeft, faChevronRight, faHamburger, faRoute} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const BurgerButton = () => {
  const {collapsed, setCollapsed,visible,setVisible, stage} = useSidebarContext();
  return (
    <div
      className={StyledBurgerButton()}
      // open={collapsed}
      onClick={setCollapsed}
    >
      <FontAwesomeIcon icon={faBarsStaggered} />
    </div>
  );
};
