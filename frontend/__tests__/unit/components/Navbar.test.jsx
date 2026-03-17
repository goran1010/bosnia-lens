import { test, describe, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Navbar } from "../../../src/components/Navbar/Navbar";
import { MemoryRouter } from "react-router-dom";
import { UserDataContext } from "../../../src/contextData/UserDataContext";

describe("Render Components", () => {
  test("Navbar component", () => {
    const userData = { username: "testuser", setUserData: () => {} };
    render(
      <MemoryRouter>
        <UserDataContext value={{ userData }}>
          <Navbar />
        </UserDataContext>
      </MemoryRouter>,
    );
    const home = screen.getByText(/Home/i);
    const universities = screen.getByText(/Universities/i);
    const postalCodes = screen.getByText(/Postal Codes/i);
    const holidays = screen.getByText(/Holidays/i);
    expect(home).toBeInTheDocument();
    expect(universities).toBeInTheDocument();
    expect(postalCodes).toBeInTheDocument();
    expect(holidays).toBeInTheDocument();
  });
});
