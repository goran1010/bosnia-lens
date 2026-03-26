function LongWaitInfo({ serverIsDown }) {
  if (serverIsDown) {
    return (
      <div className="fixed w-full h-full flex items-center justify-center p-2 md:p-4 lg:p-6 xl:p-8 2xl:p-10 bg-gray-100 dark:bg-gray-900">
        <div className="bg-red-500 p-2 rounded shadow">
          <p className="text-white font-bold text-center">
            Server is currently down. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed w-full h-full flex items-center justify-center p-2 md:p-4 lg:p-6 xl:p-8 2xl:p-10 bg-gray-100 dark:bg-gray-900">
      <div className="bg-gray-500 p-2 rounded shadow">
        <p className="text-white font-bold text-center">
          Getting response from server is taking longer than expected (server
          might be waking up). Please wait...
        </p>
      </div>
    </div>
  );
}

export { LongWaitInfo };
