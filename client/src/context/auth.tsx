import axiosInstance from "@/lib/axiosInstance";
import React, { useContext, useEffect } from "react";

interface AuthContextType {
  // 引数として、tokenをstring型で受け取り、返り血は空のためvoid
  login: (token: string) => void;
  // 引数は、logoutなのでtokenを受け取らず、返り血は空のためvoid
  logout: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = React.createContext<AuthContextType>({
  login: () => {},
  logout: () => {},
});

// カスタムフックの定義
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const token = localStorage.getItem("auth_token");

  // ユーザーがtokenを所持していれば、headerに追加記述する処理
  useEffect(() => {
    axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
  }, [token]);

  // 渡されたtokenを、localStorageに保存する非同期関数
  const login = async (token: string) => {
    localStorage.setItem("auth_token", token);
  };

  // localStorageから認証tokenを削除
  const logout = () => {
    localStorage.removeItem("auth_token");
  };

  const authMethods = {
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authMethods}>{children}</AuthContext.Provider>
  );
};
