import useDarkMode from "use-dark-mode";
import {Switch} from "@nextui-org/react";
import {SunIcon} from "../icons/SunIcon.tsx";
import {MoonIcon} from "../icons/MoonIcon.tsx";

export const DarkModeSwitch = () => {
  const darkMode = useDarkMode(false);
  return (
      <div>
        <div hidden={true}>
            <button onClick={darkMode.disable}>Light Mode</button>
            <button onClick={darkMode.enable}>Dark Mode</button>
        </div>
          <Switch
              size="lg"
              color={darkMode.value ? "danger" : "default"}
              thumbIcon={({ isSelected, className }) =>
                  isSelected ? (
                      <SunIcon className={className} />
                  ) : (
                      <MoonIcon className={className} />
                  )
              }
              onChange={darkMode.toggle}
          ></Switch>
      </div>
  )
};