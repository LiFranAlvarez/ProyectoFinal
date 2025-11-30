import { createContext } from "react";
import { AuthContextType } from "../types/authContextoType";

export const AuthContext = createContext<AuthContextType | null>(null);

