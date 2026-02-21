function Footer() {
  return (
    <footer
      className="
        flex w-full p-2 bg-gray-200
        justify-center gap-8"
    >
      <p className="block text-sm font-medium text-gray-700">
        Author: Goran Jović
      </p>
      <p>
        <a
          href="mailto:goran1010jovic@gmail.com"
          className="block text-sm font-medium text-gray-700"
        >
          goran1010jovic@gmail.com
        </a>
      </p>
    </footer>
  );
}

export { Footer };
