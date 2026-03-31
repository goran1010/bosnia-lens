# Frontend Test Suite Analysis & Improvement Plan

## Current State Summary

- **Test Files:** 28
- **Total Tests:** 135 (all passing ✓)
- **Coverage:** Moderate-to-good, but gaps exist
- **Test Approach:** React Testing Library + Vitest
- **Environment:** jsdom with setup in `__tests__/setup.js`

---

## 1. Coverage Gaps

### 1.1 Untested/Under-tested Areas

**Priority: HIGH**

| Area                  | Issue                                                    | Impact                                            |
| --------------------- | -------------------------------------------------------- | ------------------------------------------------- |
| **Utility Functions** | No standalone tests for validation, formatters, handlers | Critical bugs undetected                          |
| `useTheme.js`         | Not tested at all                                        | Theme toggle may have issues                      |
| `handleTheme.js`      | Not tested                                               | Dark mode switching untested                      |
| `getCsrfToken.js`     | Not tested directly                                      | Security-critical path uncovered                  |
| Shared Components     | `Button`, `Input`, `Label`, `Select` have no tests       | Regression risk in core UI                        |
| **Context Providers** | `UserDataContext`, `NotificationContext` not tested      | State management untested                         |
| `useServerWakeUp`     | No direct hook test (only integration)                   | Cleanup logic not verified                        |
| Admin Dashboard       | Only 3+2 tests for complex forms/lists                   | PendingRequests, CurrentContributors under-tested |
| Validation Functions  | Post/Postal code validators tested minimally             | Edge cases missed                                 |

### 1.2 Error Path Testing

**Priority: HIGH**

- Limited negative test cases (what happens when fetch fails?)
- Few timeout/race condition tests
- Missing boundary condition tests (empty arrays, null values, undefined fields)
- No tests for error boundaries or fallback UI

### 1.3 Integration Testing Gaps

**Priority: MEDIUM**

- No full user flow E2E tests (login → dashboard → submit data → logout)
- Limited cross-component interaction tests
- Missing tests for complex data flows (e.g., form submission with validation)

---

## 2. Test Code Refactoring Opportunities

### 2.1 Duplicate Test Infrastructure (HIGH PRIORITY)

**Problem:** Wrapper components are duplicated across test files

- `NavbarTest`, `ProfileTest`, `ContributorDashboardTest`, etc. all define similar `Wrapper` components
- Mock setup functions are copy-pasted
- Context setup boilerplate repeated 20+ times

**Solution:** Create a shared test utilities file

```js
// __tests__/utils/testHelpers.js
export function createTestWrapper({
  initialUser = null,
  initialRoute = "/",
  additionalProviders = [],
} = {}) {
  return function Wrapper({ children }) {
    const [userData, setUserData] = useState(initialUser);
    const { notificationValue } = useNotification();

    return (
      <NotificationContext value={notificationValue}>
        <UserDataContext value={{ userData, setUserData }}>
          <MemoryRouter initialEntries={[initialRoute]}>
            <Notifications />
            {children}
          </MemoryRouter>
        </UserDataContext>
      </NotificationContext>
    );
  };
}

export function setupFetchMock(responses = {}) {
  const fetchSpy = vi.spyOn(globalThis, "fetch");
  const reset = () => fetchSpy.mockReset();
  const mock = (url, response) => {
    fetchSpy.mockImplementation((requestUrl) => {
      if (requestUrl.includes(url)) {
        return Promise.resolve(response);
      }
    });
  };
  return { fetchSpy, reset, mock };
}

export function createFetchResponse(data, ok = true) {
  return {
    ok,
    json: async () => data,
  };
}
```

**Expected Impact:** Reduce test file size by ~20%, improve maintainability

### 2.2 Missing Mock Factory Pattern

**Problem:** Mock data is hardcoded throughout tests

**Solution:** Create mock factories

```js
// __tests__/mocks/factories.js
export function createMockUser(overrides = {}) {
  return {
    id: "1",
    username: "testuser",
    email: "test@example.com",
    role: "USER",
    ...overrides,
  };
}

export function createMockPostalCode(overrides = {}) {
  return {
    code: "71000",
    city: "Sarajevo",
    post: "A",
    ...overrides,
  };
}

export function createMockWeatherData(overrides = {}) {
  return {
    days: [
      {
        datetime: "2026-01-17",
        tempmin: 5,
        tempmax: 15,
        icon: "clear-day",
      },
    ],
    ...overrides,
  };
}
```

### 2.3 Inconsistent Mock Reset Pattern

**Problem:** Some tests forget to reset `fetchMock` between tests, causing leaks

**Current Issue in AddNewData.test.jsx:**

```js
const setupFetchMock = () => {
  fetchMock.mockReset(); // Good!
  // ... but not always called
};

beforeEach(() => {
  setupFetchMock(); // Only in some imports
});
```

**Solution:** Use `beforeEach` consistently across all test files

```js
beforeEach(() => {
  vi.clearAllMocks(); // Reset all mocks, not just fetch
});

afterEach(() => {
  vi.restoreAllMocks(); // Restore real implementations
});
```

---

## 3. Missing Test Coverage by Component/Function

### 3.1 Shared Components (NEW TESTS NEEDED)

```
src/components/sharedComponents/
├── Button.jsx              ❌ No tests
├── Input.jsx               ❌ No tests
├── Label.jsx               ❌ No tests
└── Select.jsx              ❌ No tests
```

**Test template:**

```js
describe("Button Component", () => {
  test("renders with correct text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  test("calls onClick handler", async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    await user.click(screen.getByText("Click"));
    expect(handleClick).toHaveBeenCalled();
  });

  test("respects disabled prop", () => {
    render(<Button disabled>Click</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
```

### 3.2 Utility Functions (NEW TESTS NEEDED)

```
src/components/
├── utils/
│   ├── getCsrfToken.js              ❌ No tests
│   ├── handleTheme.js               ❌ No tests
│   └── longWaitInfo.jsx             ✓ Partial (only rendering)
├── Home/utils/
│   └── getDayInWeek.js              ❌ No tests
├── LogIn/utils/
│   ├── checkLoginFormValidity.js    ❌ No tests
│   ├── checkLoginFormClickValidity.js ❌ No tests
│   └── handleSubmitLogIn.js         ❌ No tests
└── Profile/utils/
    ├── handleBecomeContributor.js   ❌ No tests
    └── handleLogout.js              ❌ No tests
```

**Example test for validation:**

```js
describe("checkLoginFormValidity", () => {
  test("returns true for valid email and password", () => {
    const result = checkLoginFormValidity("test@example.com", "password123");
    expect(result).toBe(true);
  });

  test("returns false for invalid email", () => {
    const result = checkLoginFormValidity("invalid", "password123");
    expect(result).toBe(false);
  });

  test("returns false for empty password", () => {
    const result = checkLoginFormValidity("test@example.com", "");
    expect(result).toBe(false);
  });
});
```

### 3.3 Context Providers (NEW TESTS NEEDED)

```
src/contextData/
├── UserDataContext.js       ❌ No tests
└── NotificationContext.js   ❌ No tests
```

**Test for context:**

```js
describe("NotificationContext", () => {
  test("provides initial empty notifications", () => {
    let contextValue;
    function Consumer() {
      contextValue = useContext(NotificationContext);
      return null;
    }
    render(
      <NotificationContext value={{ notifications: [] }}>
        <Consumer />
      </NotificationContext>,
    );
    expect(contextValue.notifications).toEqual([]);
  });
});
```

---

## 4. Test Quality Improvements

### 4.1 Add More Error Case Testing

**Currently:** Most tests assume happy path  
**Needed:** Test network errors, validation failures, permission errors

```js
describe("AddNewData - Error Handling", () => {
  test("shows error notification on network failure", async () => {
    fetchMock.mockRejectedValue(new Error("Network error"));
    render(<AddNewData />);

    // Attempt to submit
    const result = await screen.findByText(/Network error/i);
    expect(result).toBeInTheDocument();
  });

  test("shows validation error for missing city name", async () => {
    render(<AddNewData />);

    // Try to submit without filling city
    await user.click(screen.getByRole("button", { name: /submit/i }));

    const error = await screen.findByText(/City is required/i);
    expect(error).toBeInTheDocument();
  });
});
```

### 4.2 Test Edge Cases & Boundary Conditions

```js
describe("PostalCodesResult - Edge Cases", () => {
  test("handles empty results array", () => {
    render(<PostalCodesResult results={[]} />);
    const emptyMessage = screen.getByText(/No results found/i);
    expect(emptyMessage).toBeInTheDocument();
  });

  test("handles very long postal code", () => {
    const longCode = "A".repeat(100);
    render(<PostalCodesResult results={[{ code: longCode }]} />);
    // Ensure no layout breaking
    expect(screen.getByText(longCode)).toBeInTheDocument();
  });

  test("handles null/undefined data gracefully", () => {
    render(<PostalCodesResult results={null} />);
    // Should not crash, show fallback
  });
});
```

### 4.3 Async Behavior Testing

**Currently:** Some async flows not fully tested  
**Add:** Wait conditions, timeout handling, concurrent fetches

```js
describe("useServerWakeUp - Async Behavior", () => {
  test("stops retrying after max attempts", async () => {
    vi.setConfig({ testTimeout: 10000 });
    fetchMock.mockRejectedValue(new Error("Failed"));

    const { result } = renderHook(() =>
      useServerWakeUp({ setLongWait: vi.fn() }),
    );

    await waitFor(
      () => {
        expect(fetchMock).toHaveBeenCalledTimes(1);
      },
      { timeout: 5000 },
    );
  });

  test("cancels pending requests on unmount", async () => {
    const { unmount } = renderHook(() =>
      useServerWakeUp({ setLongWait: vi.fn() }),
    );

    unmount();

    // Verify abort was called
    expect(abortController.abort).toHaveBeenCalled();
  });
});
```

---

## 5. New Test File Template

Create consistent test structure:

```js
// __tests__/components/Example/Example.test.jsx
import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Example } from "../../../src/components/Example/Example";
import { createTestWrapper, setupFetchMock } from "../../utils/testHelpers";
import { createMockUser } from "../../mocks/factories";

const user = userEvent.setup();

describe("Example Component", () => {
  let fetchHelper;

  beforeEach(() => {
    fetchHelper = setupFetchMock();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    test("renders component with default state", () => {
      render(<Example />, { wrapper: createTestWrapper() });
      expect(screen.getByText(/Example/i)).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    test("handles button click", async () => {
      render(<Example />, { wrapper: createTestWrapper() });
      await user.click(screen.getByRole("button"));
      expect(screen.getByText(/clicked/i)).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    test("shows error on fetch failure", async () => {
      fetchHelper.fetchSpy.mockRejectedValue(new Error("API Error"));
      render(<Example />, { wrapper: createTestWrapper() });

      const error = await screen.findByText(/error/i);
      expect(error).toBeInTheDocument();
    });
  });
});
```

---

## 6. Recommended Test Additions (Priority Ranking)

### Priority 1 (CRITICAL) - Add Within 1-2 Weeks

- [ ] Shared component tests (Button, Input, Select, Label)
- [ ] Utility function tests (validation, handlers)
- [ ] Extract test helpers to reduce duplication
- [ ] Add consistent mock reset pattern across all tests
- [ ] Error path tests for critical flows (login, signup)

### Priority 2 (HIGH) - Add Within 1 Month

- [ ] Context provider tests
- [ ] Theme utility tests (useTheme, handleTheme)
- [ ] Edge case tests for all list components
- [ ] Accessibility tests (a11y) using jest-axe
- [ ] Admin dashboard component tests

### Priority 3 (MEDIUM) - Add Within 2 Months

- [ ] E2E user flow tests (cypress or playwright)
- [ ] Performance tests for heavy components
- [ ] Visual regression tests (Percy or Chromatic)
- [ ] CSRF token tests (security-critical)
- [ ] Concurrent async behavior tests

### Priority 4 (NICE-TO-HAVE)

- [ ] Snapshot tests for complex UI (use sparingly)
- [ ] Visual testing for theme switching
- [ ] Internationalization tests (if multilingual planned)

---

## 7. Tooling Suggestions

### Add Jest-DOM Matchers (Already Using)

✓ Currently configured in setup.js

### Add jest-axe for A11y Testing

```bash
npm install --save-dev jest-axe
```

```js
// In tests
const { axe, toHaveNoViolations } = require("jest-axe");
expect.extend(toHaveNoViolations);

test("page has no accessibility violations", async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Add Test Coverage Reporting

```json
// vite.config.js
{
  "test": {
    "coverage": {
      "reporter": ["text", "json", "html"],
      "exclude": [...],
      "lines": 80,
      "functions": 80,
      "branches": 75,
      "statements": 80
    }
  }
}
```

---

## 8. Testing Best Practices Checklist

- [ ] All tests use consistent `beforeEach`/`afterEach` cleanup
- [ ] No shared state between tests (each test is isolated)
- [ ] Mocks are scoped to test (not global unless necessary)
- [ ] Tests verify behavior, not implementation details
- [ ] Test names clearly describe what is being tested
- [ ] No hardcoded delays/timeouts (use waitFor)
- [ ] Mock factories used for all test data
- [ ] Wrapper components centralized in test utils
- [ ] Coverage tracking in CI/CD pipeline
- [ ] Regular review of test effectiveness

---

## 9. Quick Win Recommendations

These can be implemented in 1-2 hours:

1. **Extract test helpers** (saves 30+ minutes per test)
   - Move Wrapper components to `__tests__/utils/testHelpers.js`
   - Move setupFetchMock to same file
   - Update all imports

2. **Create mock factories** (saves 15+ minutes per test)
   - Create `__tests__/mocks/factories.js`
   - Add user, postal code, weather, notification factories
   - Use across all tests

3. **Standardize beforeEach/afterEach** (saves future debugging)
   - Ensure all tests reset mocks consistently
   - Add template at top of each test file

4. **Add missing simple tests** (30 minutes)
   - Add 3-4 tests for shared components
   - Add basic tests for utility functions

---

## 10. Testing Metrics to Track

Monitor these metrics monthly:

```markdown
- Overall Coverage: 0% (currently not tracked, target: 80%+)
- Lines Coverage: TBD
- Branch Coverage: TBD
- Function Coverage: TBD
- Test to Code Ratio: ~0.5:1 (135 tests / 70 source files)
- Average Test Duration: 4.25s / 28 files ≈ 150ms per test
- Test Pass Rate: 100% (135/135)
```

---

## Summary

**Strengths:**

- ✅ Good integration test coverage for pages
- ✅ Proper use of React Testing Library
- ✅ Tests focus on user behavior
- ✅ No tests relying on implementation details

**Weaknesses:**

- ❌ Significant gaps in utility/component testing
- ❌ Lots of duplicate test infrastructure
- ❌ Limited error path testing
- ❌ No accessibility testing
- ❌ No E2E tests for critical flows

**Actionable Next Steps:**

1. Extract shared test utilities (1-2 hours)
2. Create mock factories (1 hour)
3. Add shared component tests (2-3 hours)
4. Add utility function tests (3-4 hours)
5. Implement coverage tracking in CI/CD

**Estimated Effort:** 15-20 hours for complete coverage improvements
