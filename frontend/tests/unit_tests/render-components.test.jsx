import { test, describe, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "../../src/components/Home/Home";
import Holidays from "../../src/components/Holidays";
import PostalCodes from "../../src/components/PostalCodes/PostalCodes";
import Universities from "../../src/components/Universities";
import Footer from "../../src/components/Footer";
import Navbar from "../../src/components/Navbar/Navbar";
import { MemoryRouter } from "react-router-dom";
import ErrorPage from "../../src/components/ErrorPage";
import UserDataContext from "../../src/utils/UserDataContext";

describe("Render Components", () => {
  test("Home component", () => {
    render(<Home />);
    const linkElement = screen.getByText(/Bosnia Lens/i);
    expect(linkElement).toBeInTheDocument();
  });

  test("Holidays component", () => {
    render(<Holidays />);
    const linkElement = screen.getByText(/Holidays/i);
    expect(linkElement).toBeInTheDocument();
  });

  test("PostalCodes component", () => {
    render(
      <UserDataContext value={{ message: [], setMessage: () => {} }}>
        <PostalCodes />
      </UserDataContext>
    );
    const linkElement = screen.getByText(/Postal Code or Municipality/i);
    expect(linkElement).toBeInTheDocument();
  });

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
          <Navbar />
        </UserDataContext>
      </MemoryRouter>
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

  test("Error component", () => {
    render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>
    );
    const linkElement = screen.getByText(/There is nothing here, sorry./i);
    expect(linkElement).toBeInTheDocument();
  });

  test("SignUp component", () => {
    render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>
    );

    const linkElement = screen.getByText(/There is nothing here, sorry./i);
    expect(linkElement).toBeInTheDocument();
  });
});
