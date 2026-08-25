import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Seo } from "../../components/common/Seo";
import { useContentPage } from "../../hooks/useContent";

export function ContentPage({ slug }: { slug: string }) {
  const navigate = useNavigate();
  const { data: page, isLoading, isError } = useContentPage(slug);

  return (
    <div className="min-h-screen bg-background">
      {page && <Seo title={page.title} description={page.title} path={`/${slug}`} />}
      <div className="max-w-3xl mx-auto px-5 py-10 md:py-14">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-3.5 h-3.5" />Back
        </button>

        {isLoading && <div className="h-6 w-48 bg-muted rounded animate-pulse" />}

        {isError && (
          <div className="text-center py-16">
            <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans'] mb-2">Page not found</h1>
            <p className="text-sm text-muted-foreground">This page isn't available right now.</p>
          </div>
        )}

        {page && (
          <>
            <h1 className="text-2xl md:text-3xl font-extrabold font-['Plus_Jakarta_Sans'] mb-6">{page.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: page.bodyHtml }} />
          </>
        )}
      </div>
    </div>
  );
}
