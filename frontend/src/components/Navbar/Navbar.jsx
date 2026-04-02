import { Status } from "./Status";
import { useContext } from "react";
import { UserDataContext } from "../../contextData/UserDataContext";
import { useTheme } from "../../utils/useTheme";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { MobileMenu } from "./MobileMenu";
import { StandardMenu } from "./StandardMenu";
import { Button } from "../sharedComponents/Button";

function Navbar({
  isMenuOpen,
  setIsMenuOpen,
  isThemeMenuOpen,
  setThemeMenuOpen,
}) {
  const { setMode } = useTheme();
  const { userData } = useContext(UserDataContext);

  return (
    <nav className="relative px-2 bg-gray-300 w-full dark:bg-gray-800 dark:text-white font-bold grid grid-cols-3 lg:flex lg:justify-between items-center gap-2 transition transform">
      <div className="relative">
        <Button
          className="bg-gray-300 dark:bg-gray-800 border border-gray-500 dark:border-gray-400 text-gray-800 dark:text-white min-w-20"
          id="theme-switcher"
          onClick={() => {
            setThemeMenuOpen((prev) => !prev);
            setIsMenuOpen(false);
          }}
        >
          {isThemeMenuOpen ? "Choose" : "Theme"}
        </Button>
        {isThemeMenuOpen && (
          <ThemeSwitcher
            setMode={setMode}
            setThemeMenuOpen={setThemeMenuOpen}
          />
        )}
      </div>
      <div className="flex lg:hidden justify-center items-center py-2">
        <Button
          type="button"
          className="py-2 px-3 rounded border border-gray-500 dark:border-gray-400 bg-gray-300 w-full dark:bg-gray-800 dark:text-white text-gray-800"
          aria-label="Toggle navigation menu"
          aria-controls="mobile-menu"
          aria-expanded={isMenuOpen}
          onClick={() => {
            setIsMenuOpen((prev) => !prev);
            setThemeMenuOpen(false);
          }}
        >
          {isMenuOpen ? "Close" : "Menu"}
        </Button>
      </div>

      {isMenuOpen && (
        <MobileMenu setIsMenuOpen={setIsMenuOpen} userData={userData} />
      )}

      <StandardMenu userData={userData} />

      <div
        className="flex justify-center items-center"
        onClick={() => {
          isMenuOpen && setIsMenuOpen(false);
          isThemeMenuOpen && setThemeMenuOpen(false);
        }}
      >
        <Status />
      </div>
    </nav>
  );
}

export { Navbar };
