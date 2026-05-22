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
  const { navRef, isMenuOpen, setIsMenuOpen } = closeMenu;
  const { theme, setMode } = useTheme();
  const { userData } = useContext(UserDataContext);
  const { language, setLanguage, t } = useContext(LanguageContext);

  return (
    <nav
      ref={navRef}
      onClick={() => {
        setIsMenuOpen(false);
      }}
      className="z-40 px-3 py-1 w-full font-bold grid grid-cols-3 lg:flex lg:justify-between items-center gap-2 lg:gap-3 transition transform text-(--text-primary) border-b border-(--border-color) backdrop-blur
     sticky top-0 left-0 shadow-md"
    >
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <ThemeSwitcher theme={theme} setMode={setMode} />
      </div>
      <div className="flex lg:hidden justify-center items-center py-2">
        <ButtonNavbar
          id="mobile-menu-toggle"
          type="button"
          aria-label={t("nav.toggleMenuAria")}
          aria-controls="mobile-menu"
          aria-expanded={isMenuOpen}
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen((prev) => !prev);
          }}
        >
          {isMenuOpen ? t("nav.close") : t("nav.menu")}
        </ButtonNavbar>
      </div>

      {isMenuOpen && (
        <MobileMenu setIsMenuOpen={setIsMenuOpen} userData={userData} />
      )}

      <StandardMenu setIsMenuOpen={setIsMenuOpen} userData={userData} />

      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <LanguageSwitcher language={language} setLanguage={setLanguage} />
      </div>
    </nav>
  );
}

export { Navbar };
