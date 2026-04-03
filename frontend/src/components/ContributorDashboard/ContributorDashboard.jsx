import { useContext } from "react";
import { UserDataContext } from "../../contextData/UserDataContext";
import { ContributorForm } from "./ContributorForm";

function ContributorDashboard() {
  const { userData } = useContext(UserDataContext);

  if (!userData) {
    return (
      <section className="panel-card relative min-h-full w-full flex items-center justify-center p-3">
        <p className="label-muted text-center">
          You need to be logged in and a contributor to see the contributor
          dashboard.
        </p>
      </section>
    );
  }

  if (userData?.role === "CONTRIBUTOR" || userData?.role === "ADMIN") {
    return <ContributorForm />;
  }
  return (
    <section className="panel-card relative min-h-full w-full flex items-center justify-center p-3">
      <p className="label-muted text-center">
        You need to be a contributor to see the contributor dashboard.
      </p>
    </section>
  );
}

export { ContributorDashboard };
