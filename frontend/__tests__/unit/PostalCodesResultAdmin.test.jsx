import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PostalCodesResultAdmin } from "../../src/components/AdminDashboard/PostalCodesResultAdmin";
import { NotificationContext } from "../../src/utils/NotificationContext";

const user = userEvent.setup();

function Wrapper(
  searchResult = [],
  setSearchResult = () => {},
  addNotification = () => {},
) {
  return (
    <NotificationContext value={{ addNotification }}>
      <PostalCodesResultAdmin
        searchResult={searchResult}
        setSearchResult={setSearchResult}
      />
    </NotificationContext>
  );
}

describe("render PostalCodesResultAdmin component", () => {
  test("renders search results", () => {
    const searchResult = [
      { code: 71000, city: "Sarajevo", post: "71000" },
      { code: 75000, city: "Tuzla", post: "75000" },
    ];
    render(Wrapper(searchResult));

    const sarajevoInput = screen.getByDisplayValue("Sarajevo");
    const tuzlaInput = screen.getByDisplayValue("Tuzla");

    expect(sarajevoInput).toBeInTheDocument();
    expect(tuzlaInput).toBeInTheDocument();
  });
});
