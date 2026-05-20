import { describe, test, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Api } from "../../../src/components/Api/Api";
import { LanguageContext } from "../../../src/contextData/LanguageContext";
import { useLanguage } from "../../../src/customHooks/useLanguage";
import {
  endpoints,
  authenticatedGroups,
} from "../../../src/components/Api/utils/endpoints";

function MockLanguageProvider({ children }) {
  const languageData = useLanguage();
  return <LanguageContext value={languageData}>{children}</LanguageContext>;
}

function renderApi() {
  render(
    <MockLanguageProvider>
      <Api />
    </MockLanguageProvider>,
  );
}

describe("Api component", () => {
  test("renders the main REST API heading", async () => {
    renderApi();
    const heading = await screen.findByRole("heading", {
      name: /REST API/i,
      level: 1,
    });
    expect(heading).toBeInTheDocument();
  });

  test("renders the postal code object section heading", () => {
    renderApi();
    expect(
      screen.getByRole("heading", { name: /Postal code object/i, level: 2 }),
    ).toBeInTheDocument();
  });

  test("renders postal code schema snippet", () => {
    renderApi();
    expect(screen.getByText(/POSTE_SRP/)).toBeInTheDocument();
  });

  test("renders the Endpoints section heading", () => {
    renderApi();
    expect(
      screen.getByRole("heading", { name: /^Endpoints$/i, level: 2 }),
    ).toBeInTheDocument();
  });

  test("renders all public endpoint paths", () => {
    renderApi();
    for (const ep of endpoints) {
      expect(screen.getAllByText(ep.path).length).toBeGreaterThan(0);
    }
  });

  test("renders the authenticated data contribution flow section heading", () => {
    renderApi();
    expect(
      screen.getByRole("heading", {
        name: /Authenticated Data Contribution Flow/i,
        level: 2,
      }),
    ).toBeInTheDocument();
  });

  test("renders all authenticated group titles", () => {
    renderApi();
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(
      authenticatedGroups.length,
    );
  });

  test("renders all authenticated endpoint paths", () => {
    renderApi();
    for (const group of authenticatedGroups) {
      for (const ep of group.endpoints) {
        expect(screen.getAllByText(ep.path).length).toBeGreaterThan(0);
      }
    }
  });

  test("renders method tags for authenticated endpoints", () => {
    renderApi();
    const authSection = screen
      .getByRole("heading", { name: /Authenticated Data Contribution Flow/i })
      .closest("section");
    expect(within(authSection).getAllByText("GET").length).toBeGreaterThan(0);
    expect(within(authSection).getAllByText("POST").length).toBeGreaterThan(0);
  });

  test("renders session credentials note", () => {
    renderApi();
    expect(screen.getByText(/credentials: include/i)).toBeInTheDocument();
  });

  test("renders CSRF protection note", () => {
    renderApi();
    expect(screen.getByText(/CSRF protection/i)).toBeInTheDocument();
  });
});
