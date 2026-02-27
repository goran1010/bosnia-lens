import { useContext } from "react";
import { UserDataContext } from "../../contextData/UserDataContext";
import { ContributorForm } from "./ContributorForm";

function ContributorDashboard() {
  const { userData } = useContext(UserDataContext);

  if (userData?.isContributor || userData?.isAdmin) {
    return (
      <>
        <ContributorForm />
      </>
    );
  }
  return <>User needs to be a contributor to see the dashboard.</>;
}

export { ContributorDashboard };
