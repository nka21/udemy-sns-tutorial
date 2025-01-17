import type { AppProps } from "next/app";
import "@/styles/globals.css";

import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/auth";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Navbar />
      <Component {...pageProps} />
    </AuthProvider>
  );
}
