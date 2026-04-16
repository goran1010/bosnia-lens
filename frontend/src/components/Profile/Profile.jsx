import { NotificationContext } from "../../contextData/NotificationContext";
import { useContext, useEffect } from "react";
import { UserDataContext } from "../../contextData/UserDataContext";
import { useNavigate } from "react-router-dom";
import { handleBecomeContributor } from "./utils/handleBecomeContributor";
import { handleLogout } from "./utils/handleLogout";
import { Button } from "../sharedComponents/Button";
import { useState } from "react";
import { Spinner } from "../../utils/Spinner";

function Profile() {
  const { addNotification } = useContext(NotificationContext);
  const { userData, setUserData } = useContext(UserDataContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) {
      addNotification({
        type: "warning",
        message: "You need to be logged in. Redirected to the login page.",
      });
      navigate("/login");
      return;
    }
  }, [userData, navigate, addNotification]);

  return (
    <div className="panel-card w-full max-w-md mx-auto overflow-hidden">
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 p-4">
        <h1 className="text-2xl font-bold text-white text-center">
          My Profile
        </h1>
      </div>

      <div className="p-4 flex flex-col gap-3 text-center items-center">
        <dl className="w-full flex flex-col gap-3">
          <div>
            <dt className="label-muted block text-sm font-semibold uppercase tracking-wide">
              Email Address
            </dt>
            <dd className="text-lg font-bold">{userData?.email}</dd>
          </div>
          <hr className="divider-muted" />
          <div>
            <dt className="label-muted block text-sm font-semibold uppercase tracking-wide">
              Username
            </dt>
            <dd className="text-lg font-bold">{userData?.username}</dd>
          </div>
          <hr className="divider-muted" />
          <div>
            <dt className="label-muted block text-sm font-semibold uppercase tracking-wide">
              Current Role
            </dt>
            <dd className="flex items-center justify-center">
              <span
                className={`items-center px-4 py-2 rounded-full text-sm font-bold ${
                  userData?.role === "CONTRIBUTOR"
                    ? "role-pill-contributor"
                    : userData?.role === "ADMIN"
                      ? "role-pill-admin"
                      : "role-pill-user"
                }`}
              >
                {userData?.role}
              </span>
            </dd>
          </div>
          <hr className="divider-muted" />
        </dl>
        <div className="flex flex-col gap-2 w-full max-w-sm">
          {userData?.role === "USER" && !userData?.requestedContributor && (
            <Button
              onClick={() =>
                handleBecomeContributor(
                  addNotification,
                  setUserData,
                  setLoading,
                )
              }
              className="w-full px-6 py-3 font-semibold"
              type="submit"
              disabled={loading}
            >
              <div className="h-full w-full flex justify-center items-center absolute">
                {loading && <Spinner />}
              </div>
              <span className={`${loading ? "invisible" : "visible"}`}>Request Contributor role</span>
            </Button>
          )}

          <Button
            onClick={() =>
              handleLogout(addNotification, navigate, setUserData, setLoading)
            }
            className="btn-danger px-6 py-3 font-semibold"
            type="submit"
            disabled={loading}
          >
            <div className="h-full w-full flex justify-center items-center absolute">
              {loading && <Spinner />}
            </div>
            <span className={`${loading ? "invisible" : "visible"}`}>Log Out</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export { Profile };
