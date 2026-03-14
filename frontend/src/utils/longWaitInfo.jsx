function LongWaitInfo() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center m-2 md:m-4 lg:m-6 xl:m-8 2xl:m-10">
      <div className="bg-gray-500 p-2 rounded shadow">
        <p className="text-white font-bold">
          This is taking longer than expected (server might be waking up).
          Please wait...
        </p>
      </div>
    </div>
  );
}

export { LongWaitInfo };
