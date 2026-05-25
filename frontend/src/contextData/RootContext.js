import { createContext } from "react";

const UserData = null;
const Language = {
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
};

const Notification = null;
const ServerStatus = null;

const RootContext = createContext({
  UserData,
  Language,
  Notification,
  ServerStatus,
});

export { RootContext };
