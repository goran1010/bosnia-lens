import { PendingChanges } from "./PendingChanges";

function AdminForm() {
  return (
    <div className="relative min-h-full w-full flex items-center justify-center p-3">
      <section className="panel-card w-full max-w-6xl p-4 md:p-6 flex flex-col gap-4">
        <h1 className="text-center text-2xl font-bold pb-2 border-b-2 divider-muted">
          Admin Dashboard
        </h1>

        <PendingChanges />
      </section>
    </div>
  );
}
export { AdminForm };
