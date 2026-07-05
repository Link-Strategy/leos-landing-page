"use client";

import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatBlogDate } from "@/lib/blog-utils";

import type { BlogArticle } from "@/lib/blog/types";
type Article = BlogArticle;

interface Category {
  slug: string;
  label: string;
  count: number;
}

interface Props {
  articles: Article[];
  categories: Category[];
}

function DateBadge({ day, month }: { day: number; month: number }) {
  return (
    <div style={{
      position: "absolute" as const, bottom: 0, right: 0, zIndex: 2,
      display: "flex", flexDirection: "column" as const,
      alignItems: "center", justifyContent: "center",
      width: 118, padding: "17px 21px",
      borderTop: "1px solid rgb(255,255,255)",
      borderLeft: "1px solid rgb(255,255,255)",
      borderStyle: "solid",
      borderRadius: "0 0 20px 0",
      background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(244,244,244,0.2) 100%)",
      backdropFilter: "blur(13px)",
      WebkitBackdropFilter: "blur(13px)",
      boxShadow: "rgba(0,0,0,0.15) 0px 1px 10px 0px",
      textAlign: "center" as const, color: "white",
    }}>
      <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 36, fontWeight: 700, lineHeight: "54px", color: "white" }}>
        {day}
      </div>
      <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 16, fontWeight: 400, lineHeight: "20.8px", color: "white" }}>
        Tháng {month}
      </div>
    </div>
  );
}

function EmptyTab({ label }: { label: string }) {
  return (
    <div className="text-center py-20">
      <p className="text-zinc-400 text-lg">Chưa có bài viết cho chủ đề &ldquo;{label}&rdquo;</p>
    </div>
  );
}

function ContentSection({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <div style={{ paddingTop: 32 }}>
      <h2 style={{
        fontFamily: "Archivo, sans-serif", fontSize: 24, fontWeight: 700,
        color: "white", marginBottom: 32,
      }}>
        Tất cả các bài tin
      </h2>

      {/* FEATURED CAROUSEL */}
      <div style={{
        display: "flex", flexDirection: "row",
        gap: "0px 126px",
        paddingTop: 24, paddingRight: 60, paddingBottom: 24, paddingLeft: 60,
        borderRadius: 20,
        backgroundColor: "rgba(255,255,255,0.06)",
        boxShadow: "rgba(12,178,255,0.12) 0px 2px 20px 0px",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: "1px solid transparent",
        position: "relative" as const,
        boxSizing: "border-box",
      }}>
        <div style={{
          position: "absolute" as const, inset: 0, borderRadius: 20,
          pointerEvents: "none" as const,
          background: "linear-gradient(rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 35%, rgba(125,229,255,0.4) 75%, rgba(174,203,255,0.4) 100%)",
        }} />
        <Carousel opts={{ loop: true, align: "start" }}>
          <CarouselContent>
            {articles.slice(0, 3).map((a) => {
              const d = a.publishedAt ? new Date(a.publishedAt) : new Date();
              return (
                <CarouselItem key={a.slug}>
                  <Link href={`/blog/${a.slug}`} className="group" style={{ display: "block" }}>
                    <div style={{
                      display: "flex", flexDirection: "row" as const,
                      gap: "0 64px", padding: 0, alignItems: "normal" as const,
                    }}>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column" as const, gap: 34 }}>
                        <h3 style={{
                          fontFamily: "Archivo, sans-serif", fontSize: 32,
                          fontWeight: 700, lineHeight: "48px",
                          color: "white", margin: 0,
                        }}>
                          {a.title}
                        </h3>
                        <div style={{
                          fontFamily: "Archivo, sans-serif", fontSize: 24,
                          fontWeight: 400, lineHeight: "36px",
                          color: "rgba(255,255,255,0.6)", margin: 0,
                        }}>
                          {a.excerpt}
                        </div>
                        <div style={{ width: "fit-content" }}>
                          <span style={{
                            display: "inline-flex", alignItems: "center" as const,
                            gap: "normal",
                            fontFamily: "Archivo, sans-serif", fontSize: 20,
                            fontWeight: 600, lineHeight: "26px",
                            padding: "10px 21px",
                            backgroundColor: "rgb(52,211,153)",
                            color: "white",
                            borderRadius: 100,
                            flexDirection: "row-reverse" as const,
                          }}>
                            <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                              <path clipRule="evenodd" d="M18.5303 12.5303C18.8232 12.2374 18.8232 11.7626 18.5303 11.4697L14.5303 7.46967C14.2374 7.17678 13.7626 7.17678 13.4697 7.46967C13.1768 7.76256 13.1768 8.23744 13.4697 8.53033L16.1893 11.25H6C5.58579 11.25 5.25 11.5858 5.25 12C5.25 12.4142 5.58579 12.75 6 12.75H16.1893L13.4697 15.4697C13.1768 15.7626 13.1768 16.2374 13.4697 16.5303C13.7626 16.8232 14.2374 16.8232 14.5303 16.5303L18.5303 12.5303Z" fill="white" fillRule="evenodd" />
                            </svg>
                            <span>Đọc thêm</span>
                          </span>
                        </div>
                      </div>
                      <div style={{ flex: 1, position: "relative" as const }}>
                        <div style={{ overflow: "hidden", borderRadius: 26, zIndex: 1 }}>
                          <img
                            src={a.coverImage || "/wp-content/uploads/2026/05/1-10.jpg"} alt={a.title}
                            style={{
                              width: "100%", height: "auto",
                              aspectRatio: "789/522", objectFit: "cover" as const,
                              borderRadius: 26, transitionDuration: "0.6s",
                            }}
                            className="group-hover:scale-105"
                          />
                        </div>
                        <DateBadge day={d.getDate()} month={d.getMonth() + 1} />
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <div className="flex items-center gap-4 mt-6">
            <CarouselPrevious className="static translate-y-0 w-10 h-10 rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20" />
            <CarouselNext className="static translate-y-0 w-10 h-10 rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20" />
          </div>
        </Carousel>
      </div>

      {/* GRID */}
      {articles.length > 1 && (
        <div style={{
          marginTop: 60,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
          rowGap: 60,
          padding: 0,
        }}>
          {articles.slice(1).map((a) => {
            const d = a.publishedAt ? new Date(a.publishedAt) : new Date();
            return (
              <Link key={a.slug} href={`/blog/${a.slug}`} className="group" style={{ display: "flex", flexDirection: "column" as const }}>
                <div style={{ position: "relative" as const, display: "flex", flexDirection: "column" as const }}>
                  <div style={{ overflow: "hidden", borderRadius: 26, zIndex: 1 }}>
                    <img
                      src={a.coverImage || "/wp-content/uploads/2026/05/1-10.jpg"} alt={a.title}
                      style={{
                        width: "100%", height: "auto",
                        aspectRatio: "544/360", objectFit: "cover" as const,
                        borderRadius: 26, transitionDuration: "0.6s",
                      }}
                      className="group-hover:scale-105"
                    />
                  </div>
                  <DateBadge day={d.getDate()} month={d.getMonth() + 1} />
                </div>
                <h3 style={{
                  fontFamily: "Archivo, sans-serif",
                  fontSize: 20, fontWeight: 700, lineHeight: "30px", color: "white",
                  marginTop: 26, paddingTop: 26,
                  borderTop: "1px solid rgb(75, 101, 148)",
                }}>
                  {a.title}
                </h3>
                <p className="mt-3 text-sm line-clamp-2" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {a.excerpt}
                </p>
                <p className="mt-2 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {formatBlogDate(d.toISOString())} &middot; {a.readingTimeMinutes} phút đọc
                </p>
              </Link>
            );
          })}
        </div>
      )}

      {/* PAGINATION */}
      {articles.length > 9 && (
        <nav aria-label="Pagination" style={{
          display: "flex", justifyContent: "center", alignItems: "center",
          gap: 8, marginTop: 60,
        }}>
          <span style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 40, height: 40, borderRadius: 8,
            backgroundColor: "rgb(52,211,153)", color: "white",
            fontSize: 14,
          }}>1</span>
          {Array.from({ length: Math.ceil(articles.length / 9) - 1 }, (_, i) => i + 2).map((p) => (
            <span key={p} style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 40, height: 40, borderRadius: 8,
              backgroundColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)",
              fontSize: 14,
            }}>{p}</span>
          ))}
        </nav>
      )}
    </div>
  );
}

export default function BlogClient({ articles, categories }: Props) {
  return (
    <div style={{ backgroundColor: "#0D1B4B" }}>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", padding: "16px 0" }}>
        <div style={{ padding: "0 80px", maxWidth: 1680, margin: "0 auto" }}>
          <Tabs defaultValue="tat-ca">
            <TabsList
              variant="elementor"
              className="tab-new"
              style={{
                display: "flex", gap: 6, padding: "4px 6px",
                justifyContent: "center", flexWrap: "wrap" as const,
                overflow: "auto hidden", margin: "0 auto",
                width: "fit-content", position: "relative" as const,
                borderRadius: 100,
                background: "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.14) 100%)",
                boxShadow: "inset 0 2px 16px rgba(0,149,255,0.26)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                scrollbarWidth: "none" as const,
              }}
            >
              <TabsTrigger
                variant="elementor"
                value="tat-ca"
                style={{
                  fontFamily: "Archivo, sans-serif", fontSize: 14, fontWeight: 600,
                  lineHeight: "150%", borderRadius: 100,
                  padding: "6px 14px", cursor: "pointer", border: "none",
                  textTransform: "uppercase" as const,
                }}
                className="data-[state=active]:bg-[linear-gradient(180deg,#E2F3FF_0%,#FFFFFF_100%)] data-[state=active]:text-[#2A9FFF] data-[state=inactive]:bg-transparent data-[state=inactive]:text-white"
              >
                Tất cả
              </TabsTrigger>
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat.slug}
                  variant="elementor"
                  value={cat.slug}
                  style={{
                    fontFamily: "Archivo, sans-serif", fontSize: 14, fontWeight: 600,
                    lineHeight: "150%", borderRadius: 100,
                    padding: "6px 14px", cursor: "pointer", border: "none",
                    textTransform: "uppercase" as const,
                  }}
                  className="data-[state=active]:bg-[linear-gradient(180deg,#E2F3FF_0%,#FFFFFF_100%)] data-[state=active]:text-[#2A9FFF] data-[state=inactive]:bg-transparent data-[state=inactive]:text-white"
                >
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="tat-ca">
              <ContentSection articles={articles} />
            </TabsContent>
            {categories.map((cat) => (
              <TabsContent key={cat.slug} value={cat.slug}>
                <EmptyTab label={cat.label} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
