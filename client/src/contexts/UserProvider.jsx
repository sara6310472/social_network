import { useState } from "react";
import { UserContext } from "./UserContext";

export function UserProvider(prop) {
  const { children } = prop;
  const [userData, setUserData] = useState(null);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
}
