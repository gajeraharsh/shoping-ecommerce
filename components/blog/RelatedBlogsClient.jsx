"use client";
import { useEffect, useMemo, useState } from "react";
import BlogCard from "./BlogCard";

export default function RelatedBlogsClient({ currentId, categoryId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const queryWithCategory = useMemo(() => {
    const qs = new URLSearchParams({ limit: "6", offset: "0" });
    if (categoryId) qs.set("category_id", String(categoryId));
    return qs.toString();
  }, [categoryId]);

  const queryAll = useMemo(() => new URLSearchParams({ limit: "6", offset: "0" }).toString(), []);

  useEffect(() => {
    let mounted = true;

    async function fetchRelated() {
      setLoading(true);
      const collected = async (url) => {
        try {
          const res = await fetch(url, { cache: "no-store" });
          if (!res.ok) return [];
          const json = await res.json();
          const list = json?.blogs || json?.data?.blogs || [];
          return list;
        } catch (_) {
          return [];
        }
      };

      // Try internal API with category
      let list = await collected(`/api/blogs?${queryWithCategory}`);
      // If empty, try internal API without category
      if (!list.length) list = await collected(`/api/blogs?${queryAll}`);

      // Fallback to direct service endpoint if internal fails completely
      if (!list.length) {
        try {
          const params = new URLSearchParams({ limit: "6", offset: "0" });
          if (categoryId) params.set("category_id", String(categoryId));
          const backend = await fetch(`/api/blogs?${params.toString()}`, { cache: "no-store" });
          if (backend.ok) {
            const json = await backend.json();
            list = json?.blogs || json?.data?.blogs || [];
          }
        } catch (_) {
          // ignore
        }
      }

      // Prefer excluding current; if that empties the list, fall back to including it
      const base = list || [];
      const preferred = base.filter((b) => b?.id !== currentId);
      const chosen = (preferred.length ? preferred : base).slice(0, 4);

      // Map to BlogCard shape
      const mapped = chosen.map((b) => {
          const images = (
            Array.isArray(b?.images) ? b.images :
            (Array.isArray(b?.media) ? b.media.map((m) => m?.url || m).filter(Boolean) :
            (b?.cover_image ? [b.cover_image] :
            (b?.banner ? [b.banner] :
            (b?.thumbnail ? [b.thumbnail] :
            (b?.image ? [b.image] : (b?.image_url ? [b.image_url] : []))))))
          ).filter(Boolean);

          const rawTags = Array.isArray(b?.tags) ? b.tags : (Array.isArray(b?.hashtags) ? b.hashtags : []);
          const tags = rawTags.map((t) => (typeof t === "string" ? t : (t?.name || "")).trim()).filter(Boolean);

          return {
            id: b.id,
            title: b.title,
            excerpt: b.short_description || b.excerpt || b.summary || "",
            image: images[0] || "",
            category: (typeof b?.category === "string" ? b.category : (b?.category?.name || b?.category_name || "")),
            date: b.published_at || b.created_at || "",
            readTime: b.read_time ? `${b.read_time} min read` : "5 min read",
            tags,
          };
        });

      if (mounted) {
        setPosts(mapped);
        setLoading(false);
      }
    }

    fetchRelated();
    return () => { mounted = false; };
  }, [currentId, queryWithCategory, queryAll, categoryId]);

  if (loading) return null;
  if (!posts.length) return null;

  return (
    <div className="bg-gray-50 dark:bg-gray-800 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
