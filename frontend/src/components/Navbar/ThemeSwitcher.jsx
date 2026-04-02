function ThemeSwitcher({ setMode, setThemeMenuOpen }) {
  return (
    <div className="z-10 pb-2 absolute top-full bg-gray-300 dark:bg-gray-800 dark:text-white left-0 w-full text-center rounded-b">
      <ul className="flex flex-col">
        <li
          className="block py-2 px-4 hover:bg-gray-400 dark:hover:bg-gray-700"
          onClick={() => {
            setMode("system");
            setThemeMenuOpen(false);
          }}
        >
          System
        </li>
        <li
          className="block py-2 px-4 hover:bg-gray-400 dark:hover:bg-gray-700"
          onClick={() => {
            setMode("light");
            setThemeMenuOpen(false);
          }}
        >
          Light
        </li>
        <li
          className="block py-2 px-4 hover:bg-gray-400 dark:hover:bg-gray-700"
          onClick={() => {
            setMode("dark");
            setThemeMenuOpen(false);
          }}
        >
          Dark
        </li>
      </ul>
    </div>
  );
}

export { ThemeSwitcher };
