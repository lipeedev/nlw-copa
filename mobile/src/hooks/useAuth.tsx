import { useContext } from "react";

import { AuthContext, AuthContextDataprops } from "../contexts/AuthContext";

export function useAuth(): AuthContextDataprops {
  const context = useContext(AuthContext);
  
  return context;
}