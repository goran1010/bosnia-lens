import { Link } from "react-router-dom";
import { Status } from "./Status";
import { useContext } from "react";
import { LanguageContext } from "../../contextData/LanguageContext";

const menuShellClass =
  "z-50 absolute top-full w-full left-0 bg-(--surface-2) text-(--text-primary) border border-(--border-color) shadow-(--card-shadow)";
const menuItemClass =
  "block p-2 w-full text-center text-nowrap rounded-lg transition-colors duration-150 hover:bg-(--hover-surface) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring) focus-visible:bg-(--hover-surface)";

function MobileMenu({ setIsMenuOpen, userData }) {
  const { t } = useContext(LanguageContext);

  return (
    <div id="mobile-menu" className={menuShellClass}>
      <ul className="flex flex-col items-center">
        <Link
          className={menuItemClass}
          to="/"
          onClick={() => setIsMenuOpen(false)}
        >
          {t("nav.home")}
        </Link>
        <Link
          className={menuItemClass}
          to="/api-docs"
          onClick={() => setIsMenuOpen(false)}
        >
          {t("nav.apiDocs")}
        </Link>
        <Link
          className={menuItemClass}
          to="/postal-codes"
          onClick={() => setIsMenuOpen(false)}
        >
          {t("nav.postalCodes")}
        </Link>

        <Link
          className={menuItemClass}
          to="/universities"
          onClick={() => setIsMenuOpen(false)}
        >
          {t("nav.universities")}
        </Link>

        {userData && (
          <Link
            className={menuItemClass}
            to="/contribution-dashboard"
            onClick={() => setIsMenuOpen(false)}
          >
            {t("nav.contribute")}
          </Link>
        )}
        {userData?.role === "ADMIN" && (
          <Link
            className={menuItemClass}
            to="/admin-dashboard"
            onClick={() => setIsMenuOpen(false)}
          >
            {t("nav.admin")}
          </Link>
        )}
        <div className="flex justify-center items-center">
          <Status setIsMenuOpen={setIsMenuOpen} />
        </div>
      </ul>
    </div>
  );
}

export { MobileMenu };
