import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { api } from "@/utils/api";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
