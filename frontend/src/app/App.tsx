import { QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "next-themes";
import { RouterProvider } from "react-router";
import { HelmetProvider } from "react-helmet-async";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./context/AuthContext";
import { LegacyStoreProvider } from "./context/LegacyStoreContext";
import { Toaster } from "./components/ui/sonner";
import { router } from "./routes/router";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <AuthProvider>
              <LegacyStoreProvider>
                <RouterProvider router={router} />
                <Toaster />
              </LegacyStoreProvider>
            </AuthProvider>
          </ThemeProvider>
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
