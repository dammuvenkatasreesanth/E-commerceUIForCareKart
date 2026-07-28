import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { RouterProvider } from "react-router";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./context/AuthContext";
import { LegacyStoreProvider } from "./context/LegacyStoreContext";
import { Toaster } from "./components/ui/sonner";
import { router } from "./routes/router";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <AuthProvider>
          <LegacyStoreProvider>
            <RouterProvider router={router} />
            <Toaster />
          </LegacyStoreProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
