import { test, describe, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Home } from "../../src/components/Home/Home";
import { Holidays } from "../../src/components/Holidays";
import { PostalCodes } from "../../src/components/PostalCodes/PostalCodes";
import { Universities } from "../../src/components/Universities";
import { Footer } from "../../src/components/Footer";
import { Navbar } from "../../src/components/Navbar/Navbar";
import { MemoryRouter } from "react-router-dom";
import { UserDataContext } from "../../src/contextData/UserDataContext";
import { NotificationContext } from "../../src/contextData/NotificationContext";

describe("Render Components", () => {
  const contextValue = {};

  test("Universities component", () => {
    render(<Universities />);
    const linkElement = screen.getByText(/Universities/i);
    expect(linkElement).toBeInTheDocument();
  });

  test("Footer component", () => {
    render(<Footer />);
    const email = screen.getByText(/goran1010jovic@gmail.com/i);
    expect(email).toBeInTheDocument();
  });

  test("Navbar component", () => {
    const userData = { username: "testuser", setUserData: () => {} };
    render(
      <MemoryRouter>
        <UserDataContext value={{ userData }}>
          <NotificationContext value={contextValue}>
            <Navbar />
          </NotificationContext>
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
