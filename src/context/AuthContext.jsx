import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("cms_user");
    let parsed = null;
    if (stored) {
      try {
        parsed = JSON.parse(stored);
      } catch {
        localStorage.removeItem("cms_user");
      }
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentUser(parsed);
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .eq("password", password)
      .single();

    if (error || !data) throw new Error("Invalid username or password");

    setCurrentUser(data);
    localStorage.setItem("cms_user", JSON.stringify(data));
    return data;
  };

  const signup = async (username, password) => {
    // Check if username is already taken
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (existing) throw new Error("Username already taken. Please choose another.");

    const { data, error } = await supabase
      .from("users")
      .insert([{ username, password, role: "user" }])
      .select()
      .single();

    if (error || !data) throw new Error("Sign up failed. Please try again.");

    setCurrentUser(data);
    localStorage.setItem("cms_user", JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("cms_user");
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
