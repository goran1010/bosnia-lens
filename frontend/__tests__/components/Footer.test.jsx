import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "../../src/components/Footer";
import { LanguageContext } from "../../src/contextData/LanguageContext";
import { useLanguage } from "../../src/customHooks/useLanguage";

function MockLanguageProvider({ children }) {
  const languageData = useLanguage();
  return <LanguageContext value={languageData}>{children}</LanguageContext>;
}

describe("ErrorPage Component", () => {
  test("Footer component", () => {
    render(
      <MockLanguageProvider>
        <Footer />
      </MockLanguageProvider>,
    );

    const name = screen.getByText(/goran jovi/i);
    expect(name).toBeInTheDocument();
    const email = screen.getByText(/goran1010jovic@gmail.com/i);
    expect(email).toBeInTheDocument();
  });
});
