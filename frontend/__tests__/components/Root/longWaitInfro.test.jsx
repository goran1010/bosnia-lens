import { render, screen } from "@testing-library/react";
import { LongWaitInfo } from "../../../src/utils/longWaitInfo";
import { describe, test, expect } from "vitest";
import { LanguageContext } from "../../../src/contextData/LanguageContext";
import { useLanguage } from "../../../src/customHooks/useLanguage";

function Wrapper({ serverIsDown }) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <LanguageContext value={{ language, setLanguage, t }}>
      <LongWaitInfo serverIsDown={serverIsDown} />
    </LanguageContext>
  );
}

describe("LongWaitInfo component", () => {
  test("renders long wait message when server is not down", () => {
    render(<Wrapper serverIsDown={false} />);
    const message = screen.getByText(
      /Getting response from the server is taking longer than expected/i,
    );
    expect(message).toBeInTheDocument();
    expect(
      screen.queryByText(/Server can't be reached after multiple attempts/i),
    ).not.toBeInTheDocument();
  });

  test("renders server down message when server is down", () => {
    render(<Wrapper serverIsDown={true} />);
    const message = screen.getByText(
      /Server can't be reached after multiple attempts/i,
    );
    expect(message).toBeInTheDocument();
    expect(
      screen.queryByText(
        /Getting response from the server is taking longer than expected/i,
      ),
    ).not.toBeInTheDocument();
  });

  test("falls back to long wait message when serverIsDown prop is omitted", () => {
    render(<Wrapper />);
    expect(
      screen.getByText(
        /Getting response from the server is taking longer than expected/i,
      ),
    ).toBeInTheDocument();
  });
});
