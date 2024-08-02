import axiosInstance from "@/lib/axiosInstance";
import React, { useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: null | {
    id: number;
    email: string;
    username: string;
  };
  // 引数として、tokenをstring型で受け取り、返り血は空のためvoid
  login: (token: string) => void;
  // 引数は、logoutなのでtokenを受け取らず、返り血は空のためvoid
  logout: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

// カスタムフックの定義
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<null | {
    id: number;
    email: string;
    username: string;
  }>(null);

  // ユーザーがtokenを所持していれば、headerに追加記述する処理
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;

      axiosInstance
        .get("/users/find")
        .then((res) => {
          setUser(res.data.user);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  // 渡されたtokenを、localStorageに保存する非同期関数
  const login = async (token: string) => {
    localStorage.setItem("auth_token", token);
    // middlewareでログインしているか判定するための記述
    axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;

    try {
      axiosInstance.get("/users/find").then((res) => {
        setUser(res.data.user);
      });
    } catch (error) {
      console.error(error);
    }
  };

  // localStorageから認証tokenを削除
  const logout = () => {
    localStorage.removeItem("auth_token");
  };

  const authMethods = {
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authMethods}>{children}</AuthContext.Provider>
  );
};
