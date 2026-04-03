import { Status } from "./Status";
import { useContext } from "react";
import { UserDataContext } from "../../contextData/UserDataContext";
import { useTheme } from "../../utils/useTheme";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { MobileMenu } from "./MobileMenu";
import { StandardMenu } from "./StandardMenu";
import { ButtonNavbar } from "./ButtonNavbar";

function Navbar({
  isMenuOpen,
  setIsMenuOpen,
  isThemeMenuOpen,
  setThemeMenuOpen,
}) {
  const { setMode } = useTheme();
  const { userData } = useContext(UserDataContext);

  return (
    <nav className="nav-shell relative px-2 w-full font-bold grid grid-cols-3 lg:flex lg:justify-between items-center gap-2 transition transform">
      <div className="relative">
        <ButtonNavbar
          id="theme-switcher"
          aria-label="Toggle theme menu"
          aria-controls="theme-menu"
          aria-expanded={isThemeMenuOpen}
          onClick={() => {
            setThemeMenuOpen((prev) => !prev);
            setIsMenuOpen(false);
          }}
        >
          {isThemeMenuOpen ? "Choose" : "Theme"}
        </ButtonNavbar>
        {isThemeMenuOpen && (
          <ThemeSwitcher
            setMode={setMode}
            setThemeMenuOpen={setThemeMenuOpen}
          />
        )}
      </div>
      <div className="flex lg:hidden justify-center items-center py-2">
        <ButtonNavbar
          type="button"
          aria-label="Toggle navigation menu"
          aria-controls="mobile-menu"
          aria-expanded={isMenuOpen}
          onClick={() => {
            setIsMenuOpen((prev) => !prev);
            setThemeMenuOpen(false);
          }}
        >
          {isMenuOpen ? "Close" : "Menu"}
        </ButtonNavbar>
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
