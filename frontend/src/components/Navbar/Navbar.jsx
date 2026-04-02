import { Status } from "./Status";
import { useContext } from "react";
import { UserDataContext } from "../../contextData/UserDataContext";
import { useTheme } from "../../utils/useTheme";
import { Select } from "../sharedComponents/Select";
import { MobileMenu } from "./MobileMenu";
import { StandardMenu } from "./StandardMenu";

function Navbar({ isMenuOpen, setIsMenuOpen }) {
  const { theme, setMode } = useTheme();
  const { userData } = useContext(UserDataContext);

  return (
    <nav className="relative px-2 bg-gray-300 w-full dark:bg-gray-800 dark:text-white font-bold grid grid-cols-3 lg:flex lg:justify-between items-center">
      <div>
        <Select
          className="bg-gray-300 dark:bg-gray-800"
          defaultValue={theme}
          name="theme-switcher"
          id="theme-switcher"
          onChange={(e) => setMode(e.target.value)}
        >
          <option className="font-bold" value="system">
            system
          </option>
          <option className="font-bold" value="light">
            light
          </option>
          <option className="font-bold" value="dark">
            dark
          </option>
        </Select>
      </div>
      <div className="flex lg:hidden justify-center items-center py-2">
        <button
          type="button"
          className="py-2 px-3 rounded border border-gray-500 dark:border-gray-400"
          aria-label="Toggle navigation menu"
          aria-controls="mobile-menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {isMenuOpen && (
        <MobileMenu setIsMenuOpen={setIsMenuOpen} userData={userData} />
      )}

      <StandardMenu userData={userData} />

      <div
        className="flex justify-end items-center"
        onClick={() => isMenuOpen && setIsMenuOpen(false)}
      >
        <Status />
      </div>
    </nav>
  );
}

export { Navbar };
