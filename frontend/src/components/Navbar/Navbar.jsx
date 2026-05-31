import { useContext } from "react";
import { RootContext } from "../../contextData/RootContext";
import { useTheme } from "../../customHooks/useTheme";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { MobileMenu } from "./MobileMenu";
import { StandardMenu } from "./StandardMenu";
import { LanguageSwitcher } from "./LanguageSwitcher";

function Navbar({ closeMenu }) {
  const { navRef, isMenuOpen, setIsMenuOpen } = closeMenu;
  const { theme, setMode } = useTheme();
  const { userData, language, setLanguage, t } = useContext(RootContext);

  return (
    <nav
      ref={navRef}
      onClick={() => {
        setIsMenuOpen(false);
      }}
      className="z-40 w-full px-1 sm:px-2 py-2 font-bold grid grid-cols-3 lg:flex lg:justify-between items-center gap-2 lg:gap-3 transition transform text-(--text-primary) border-b border-(--border-color) backdrop-blur
     sticky top-0 left-0 shadow-md"
    >
      <div className="flex lg:hidden justify-center items-center">
        <button
          id="mobile-menu-toggle"
          type="button"
          aria-label={t("nav.toggleMenuAria")}
          aria-controls="mobile-menu"
          aria-expanded={isMenuOpen}
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen((prev) => !prev);
          }}
          className="relative inline-flex items-center justify-center rounded-md p-2 transition-transform hover:cursor-pointer bg-(--surface-1) text-(--text-primary) border border-(--border-color) shadow-(--card-shadow-soft) hover:bg-(--hover-surface) hover:shadow-(--card-shadow) active:scale-[0.98]"
        >
          <span className="flex flex-col justify-center items-center w-5 h-5 gap-1.5">
            <span
              className={`block h-0.5 w-5 bg-current rounded-full transition-transform duration-300 origin-center ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block h-0.5 w-5 bg-current rounded-full transition-opacity duration-300 ${isMenuOpen ? "opacity-0 scale-x-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-5 bg-current rounded-full transition-transform duration-300 origin-center ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </span>
        </button>
      </div>
      {isMenuOpen && (
        <MobileMenu setIsMenuOpen={setIsMenuOpen} userData={userData} />
      )}

      <ThemeSwitcher theme={theme} setMode={setMode} />

      <StandardMenu setIsMenuOpen={setIsMenuOpen} userData={userData} />

      <LanguageSwitcher language={language} setLanguage={setLanguage} />
    </nav>
  );
}

export { Navbar };
