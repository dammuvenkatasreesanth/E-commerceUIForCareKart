import { useNavigate } from "react-router";

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
      <h1 className="text-3xl font-extrabold font-['Plus_Jakarta_Sans']">Page not found</h1>
      <p className="text-muted-foreground text-sm">The page you're looking for doesn't exist.</p>
      <button onClick={() => navigate("/")} className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl text-sm hover:bg-primary/90 transition-colors">
        Back to home
      </button>
    </div>
  );
}
