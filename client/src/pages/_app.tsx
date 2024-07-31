import type { AppProps } from "next/app";
import "@/styles/globals.css";

import Navbar from "@/src/components/Navbar";
import { AuthProvider } from "./auth";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Navbar />
      <Component {...pageProps} />
    </AuthProvider>
  );
}
