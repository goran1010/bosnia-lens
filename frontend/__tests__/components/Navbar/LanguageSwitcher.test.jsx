import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LanguageSwitcher } from "../../../src/components/Navbar/LanguageSwitcher";
import { NotificationContext } from "../../../src/contextData/NotificationContext";
import { LanguageContext } from "../../../src/contextData/LanguageContext";
import { useLanguage } from "../../../src/customHooks/useLanguage";
import * as languageUtils from "../../../src/utils/setInitialLanguage";

afterEach(() => {
  vi.restoreAllMocks();
});

beforeEach(() => {
  localStorage.setItem("language", "en");
});

function Wrapper({ addNotification, setLanguageMenuOpen, setLanguage }) {
  const { language, setLanguage: setLanguageState, t } = useLanguage();

  return (
    <LanguageContext value={{ language, setLanguage: setLanguageState, t }}>
      <NotificationContext
        value={{
          notifications: [],
          addNotification,
          removeNotification: vi.fn(),
        }}
      >
        <LanguageSwitcher
          setLanguageMenuOpen={setLanguageMenuOpen}
          setLanguage={setLanguage}
        />
      </NotificationContext>
    </LanguageContext>
  );
}

describe("LanguageSwitcher", () => {
  test("switches to browser language", async () => {
    vi.spyOn(languageUtils, "setInitialLanguage").mockReturnValue("sr");

    const addNotification = vi.fn();
    const setLanguageMenuOpen = vi.fn();
    const setLanguage = vi.fn();

    render(
      <Wrapper
        addNotification={addNotification}
        setLanguageMenuOpen={setLanguageMenuOpen}
        setLanguage={setLanguage}
      />,
    );

    const browserLanguageButton = screen.getByRole("button", {
      name: /Browser Language/i,
    });

    expect(browserLanguageButton).toBeInTheDocument();
    await userEvent.click(browserLanguageButton);

    expect(setLanguage).toHaveBeenCalledWith("sr");
    expect(addNotification).toHaveBeenCalledWith({
      type: "info",
      message: "Switched to browser language",
    });
    expect(setLanguageMenuOpen).toHaveBeenCalledWith(false);
  });

  test.each([
    {
      languageButton: /English/i,
      expectedLanguage: "en",
      expectedMessage: "Switched to English",
    },
    {
      languageButton: /Serbian/i,
      expectedLanguage: "sr",
      expectedMessage: "Switched to Serbian",
    },
  ])(
    "switches language using $languageButton",
    async ({ languageButton, expectedLanguage, expectedMessage }) => {
      const addNotification = vi.fn();
      const setLanguageMenuOpen = vi.fn();
      const setLanguage = vi.fn();

      render(
        <Wrapper
          addNotification={addNotification}
          setLanguageMenuOpen={setLanguageMenuOpen}
          setLanguage={setLanguage}
        />,
      );

      const languageOptionButton = screen.getByRole("button", {
        name: languageButton,
      });

      expect(languageOptionButton).toBeInTheDocument();
      await userEvent.click(languageOptionButton);

      expect(setLanguage).toHaveBeenCalledWith(expectedLanguage);
      expect(addNotification).toHaveBeenCalledWith({
        type: "info",
        message: expectedMessage,
      });
      expect(setLanguageMenuOpen).toHaveBeenCalledWith(false);
    },
  );
});
