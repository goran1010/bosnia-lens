import { useContext } from "react";
import { UserDataContext } from "../../contextData/UserDataContext";
import { useTheme } from "../../customHooks/useTheme";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { MobileMenu } from "./MobileMenu";
import { StandardMenu } from "./StandardMenu";
import { ButtonNavbar } from "./ButtonNavbar";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { LanguageContext } from "../../contextData/LanguageContext";

function Navbar({ closeMenu }) {
  const {
    navRef,
    isMenuOpen,
    setIsMenuOpen,
    isThemeMenuOpen,
    setThemeMenuOpen,
    isLanguageMenuOpen,
    setLanguageMenuOpen,
  } = closeMenu;
  const { setMode } = useTheme();
  const { userData } = useContext(UserDataContext);
  const { setLanguage } = useContext(LanguageContext);

  return (
    <nav
      ref={navRef}
      className="nav-shell z-40 px-3 py-1 w-full font-bold grid grid-cols-3 lg:flex lg:justify-between items-center gap-2 lg:gap-3 transition transform
     sticky top-0 left-0 shadow-md"
    >
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
          id="mobile-menu-toggle"
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

      <StandardMenu setIsMenuOpen={setIsMenuOpen} userData={userData} />

      <div className="relative">
        <ButtonNavbar
          id="language-switcher"
          aria-label="Toggle language menu"
          aria-controls="language-menu"
          aria-expanded={isLanguageMenuOpen}
          onClick={() => {
            setLanguageMenuOpen((prev) => !prev);
            setIsMenuOpen(false);
          }}
        >
          {isLanguageMenuOpen ? "Choose" : "Language"}
        </ButtonNavbar>
        {isLanguageMenuOpen && (
          <LanguageSwitcher
            setLanguageMenuOpen={setLanguageMenuOpen}
            setLanguage={setLanguage}
          />
        )}
      </div>
    </nav>
  );
}

export { Navbar };
