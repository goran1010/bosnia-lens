import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NotificationContext } from "../../../src/contextData/NotificationContext";
import { PostalCodes } from "../../../src/components/PostalCodes/PostalCodes";
import { LanguageContext } from "../../../src/contextData/LanguageContext";
import { useLanguage } from "../../../src/customHooks/useLanguage";

function Wrapper() {
  const { language, setLanguage, t } = useLanguage();
  const contextValue = {};

  return (
    <LanguageContext value={{ language, setLanguage, t }}>
      <NotificationContext value={contextValue}>
        <PostalCodes />
      </NotificationContext>
    </LanguageContext>
  );
}

describe("PostalCodes Component", () => {
  test("render PostalCodes", () => {
    render(<Wrapper />);

    const linkElement = screen.getByText(/Postal Code or Municipality/i);
    expect(linkElement).toBeInTheDocument();
  });
});
