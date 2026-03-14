function Footer() {
  return (
    <footer className="text-gray-700 dark:text-white bg-gray-200 w-full flex justify-between items-center dark:bg-gray-800  font-bold p-2">
      <address className="not-italic w-full flex justify-between items-center">
        <span className="block text-sm font-medium">Goran Jović</span>
        <a
          href="mailto:goran1010jovic@gmail.com"
          className="block text-sm font-medium"
        >
          goran1010jovic@gmail.com
        </a>
      </address>
    </footer>
  );
}

export { Footer };
