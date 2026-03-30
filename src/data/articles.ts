import heroImage from "@/assets/hero-fashion-1.jpg";
import peak1 from "@/assets/article-peak-1.jpg";
import peak2 from "@/assets/article-peak-2.jpg";
import plateau1 from "@/assets/article-plateau-1.jpg";
import plateau2 from "@/assets/article-plateau-2.jpg";
import foothills1 from "@/assets/article-foothills-1.jpg";
import heritage1 from "@/assets/article-heritage-1.jpg";

export type AltitudeCategory = "peak" | "plateau" | "foothills" | "heritage";

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  altitude: AltitudeCategory;
  author: string;
  designer?: string;
  fabricTags: string[];
  totalLikes: number;
  avgRating: number;
  reviewCount: number;
  publishedAt: string;
  body?: string;
}

export const altitudeLabels: Record<AltitudeCategory, string> = {
  peak: "The Peak",
  plateau: "The Plateau",
  foothills: "The Foothills",
  heritage: "Heritage Lab",
};

export const altitudeDescriptions: Record<AltitudeCategory, string> = {
  peak: "Couture & Gala — The summit of Malawian high fashion",
  plateau: "Modern Professional — Elevated daily wear",
  foothills: "Streetwear & Emerging Talent — Where new voices rise",
  heritage: "Textile History — The roots of Malawian craft",
};

export const articles: Article[] = [
  {
    id: "1",
    title: "The Rise of the Chitenje Blazer",
    slug: "rise-of-chitenje-blazer",
    excerpt: "How Malawian designers are transforming traditional Chitenje fabric into the must-have statement piece of the season — from Lilongwe boardrooms to Blantyre galas.",
    coverImage: heroImage,
    altitude: "peak",
    author: "Thandiwe Moyo",
    designer: "Atelier Mkango",
    fabricTags: ["Chitenje", "Silk Blend"],
    totalLikes: 243,
    avgRating: 4.7,
    reviewCount: 38,
    publishedAt: "2025-03-15",
    body: "The Chitenje blazer has emerged as a defining silhouette of the Malawian fashion renaissance. What began as experimental tailoring in small Lilongwe ateliers has grown into a movement — one that bridges generations, cultures, and continents.\n\nAtelier Mkango's latest collection showcases the blazer in its most refined form yet: precision-cut panels of hand-selected Chitenje fabric, married with Italian wool blends and contemporary construction techniques. The result is a garment that commands attention in any room while honouring the textile traditions that make it uniquely Malawian.\n\n\"The Chitenje is not just fabric — it is story, identity, and community woven together,\" says lead designer Chikondi Banda. \"When we cut it into a blazer, we are not diminishing its cultural significance. We are giving it a new chapter.\"\n\nThe collection features six distinct Chitenje patterns, each sourced from different regions of Malawi. The geometric motifs of the Central Region contrast beautifully with the flowing organic patterns from the Lake Malawi shore communities. Each blazer is numbered and comes with a provenance card tracing the fabric to its origin.",
  },
  {
    id: "2",
    title: "Scarlet Architecture: Gala Season's Boldest Gowns",
    slug: "scarlet-architecture-gala-gowns",
    excerpt: "This season's red carpet moments prove that Malawian couture has arrived on the global stage.",
    coverImage: peak1,
    altitude: "peak",
    author: "Zikomo Phiri",
    designer: "House of Nyasa",
    fabricTags: ["Silk", "Chiffon"],
    totalLikes: 189,
    avgRating: 4.5,
    reviewCount: 24,
    publishedAt: "2025-03-10",
  },
  {
    id: "3",
    title: "Gallery Drape: When Art Meets Ankara",
    slug: "gallery-drape-art-meets-ankara",
    excerpt: "A new exhibition explores the intersection of contemporary art and West African textile traditions through the lens of Malawian creativity.",
    coverImage: peak2,
    altitude: "peak",
    author: "Thandiwe Moyo",
    designer: "Studio Mulanje",
    fabricTags: ["Ankara", "Chitenje"],
    totalLikes: 156,
    avgRating: 4.3,
    reviewCount: 19,
    publishedAt: "2025-03-05",
  },
  {
    id: "4",
    title: "The Modern Malawian Gentleman",
    slug: "modern-malawian-gentleman",
    excerpt: "Redefining professional style with subtle Chitenje accents — how pocket squares and tie pins carry a nation's heritage.",
    coverImage: plateau1,
    altitude: "plateau",
    author: "Kondwani Mbewe",
    designer: "Sapitwa Tailors",
    fabricTags: ["Chitenje", "Wool"],
    totalLikes: 127,
    avgRating: 4.2,
    reviewCount: 15,
    publishedAt: "2025-03-12",
  },
  {
    id: "5",
    title: "Power Drape: Scarves That Command the Room",
    slug: "power-drape-scarves",
    excerpt: "From the corner office to the cultural centre — the Chitenje scarf becomes the modern professional woman's signature.",
    coverImage: plateau2,
    altitude: "plateau",
    author: "Zikomo Phiri",
    fabricTags: ["Chitenje", "Cashmere"],
    totalLikes: 98,
    avgRating: 4.0,
    reviewCount: 11,
    publishedAt: "2025-03-08",
  },
  {
    id: "6",
    title: "Street Level: Lilongwe's Youth Rewrite the Rules",
    slug: "street-level-lilongwe-youth",
    excerpt: "Bold prints, vintage sneakers, and zero apologies — a new generation of Malawian creatives is building streetwear from the ground up.",
    coverImage: foothills1,
    altitude: "foothills",
    author: "Chisomo Nkhata",
    fabricTags: ["Chitenje", "Denim"],
    totalLikes: 211,
    avgRating: 4.6,
    reviewCount: 32,
    publishedAt: "2025-03-14",
  },
  {
    id: "7",
    title: "The Living Thread: A History of Chitenje",
    slug: "living-thread-history-chitenje",
    excerpt: "Tracing the origins of Malawi's most iconic textile from Dutch wax prints to a uniquely Malawian identity — a story woven over centuries.",
    coverImage: heritage1,
    altitude: "heritage",
    author: "Dr. Alinafe Chirwa",
    fabricTags: ["Chitenje"],
    totalLikes: 312,
    avgRating: 4.9,
    reviewCount: 45,
    publishedAt: "2025-02-28",
  },
];

export const getArticlesByAltitude = (altitude: AltitudeCategory) =>
  articles.filter((a) => a.altitude === altitude);

export const getTrendingArticles = () =>
  [...articles].sort((a, b) => b.totalLikes - a.totalLikes).slice(0, 6);

export const getArticleBySlug = (slug: string) =>
  articles.find((a) => a.slug === slug);
