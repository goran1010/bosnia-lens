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

  test("render search if search result is empty", () => {
    render(Wrapper());

    const paragraphElement = screen.getByText(/No results to display./i);
    expect(paragraphElement).toBeInTheDocument();
  });

  test("handle edit", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        data: { code: 71000, city: "New Sarajevo", post: "71000" },
      }),
    });
    const mockSetSearchResult = vi.fn();
    const mockAddNotification = vi.fn();

    const searchResult = [{ code: 71000, city: "Sarajevo", post: "71000" }];

    render(Wrapper(searchResult, mockSetSearchResult, mockAddNotification));

    const cityInput = screen.getByDisplayValue("Sarajevo");
    await user.clear(cityInput);
    await user.type(cityInput, "New Sarajevo");

    const editButton = screen.getByRole("button", { name: /Save Edit/i });
    await user.click(editButton);

    expect(cityInput).toHaveValue("New Sarajevo");
    expect(mockSetSearchResult).toHaveBeenCalled();
    expect(mockAddNotification).toHaveBeenCalledWith({
      type: "success",
      message: "Postal code updated successfully!",
    });
  });

  test("handle edit with API error", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      json: async () => ({
        error: "Failed to update postal code.",
        details: [{ msg: null }],
      }),
    });
    const mockAddNotification = vi.fn();

    const searchResult = [{ code: 71000, city: "Sarajevo", post: "71000" }];

    render(Wrapper(searchResult, () => {}, mockAddNotification));

    const cityInput = screen.getByDisplayValue("Sarajevo");
    await user.clear(cityInput);
    await user.type(cityInput, "New Sarajevo");

    const editButton = screen.getByRole("button", { name: /Save Edit/i });
    await user.click(editButton);

    expect(cityInput).toHaveValue("New Sarajevo");
    expect(mockAddNotification).toHaveBeenCalledWith({
      type: "error",
      message: "Failed to update postal code.",
      details: null,
    });
  });
});
