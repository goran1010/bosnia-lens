import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeSwitcher } from "../../../src/components/Navbar/ThemeSwitcher";
import { NotificationContext } from "../../../src/contextData/NotificationContext";
import { LanguageContext } from "../../../src/contextData/LanguageContext";
import { useLanguage } from "../../../src/customHooks/useLanguage";

function Wrapper({ addNotification, setThemeMenuOpen, setMode }) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <LanguageContext value={{ language, setLanguage, t }}>
      <NotificationContext
        value={{
          notifications: [],
          addNotification,
          removeNotification: vi.fn(),
        }}
      >
        <ThemeSwitcher setMode={setMode} setThemeMenuOpen={setThemeMenuOpen} />
      </NotificationContext>
    </LanguageContext>
  );
}

describe("ThemeSwitcher", () => {
  test.each([
    {
      themeButton: /^System$/i,
      expectedMode: "system",
      expectedMessage: "Switched to system theme",
    },
    {
      themeButton: /^Light$/i,
      expectedMode: "light",
      expectedMessage: "Switched to light theme",
    },
    {
      themeButton: /^Dark$/i,
      expectedMode: "dark",
      expectedMessage: "Switched to dark theme",
    },
  ])(
    "changes mode using $themeButton",
    async ({ themeButton, expectedMode, expectedMessage }) => {
      const addNotification = vi.fn();
      const setThemeMenuOpen = vi.fn();
      const setMode = vi.fn();

      render(
        <Wrapper
          addNotification={addNotification}
          setThemeMenuOpen={setThemeMenuOpen}
          setMode={setMode}
        />,
      );

      const themeOptionButton = screen.getByRole("button", {
        name: themeButton,
      });

      expect(themeOptionButton).toBeInTheDocument();
      await userEvent.click(themeOptionButton);

      expect(setMode).toHaveBeenCalledWith(expectedMode);
      expect(addNotification).toHaveBeenCalledWith({
        type: "info",
        message: expectedMessage,
      });
      expect(setThemeMenuOpen).toHaveBeenCalledWith(false);
    },
  );
});
