/// <reference types="emdash/locals" />

import type { PortableTextBlock } from "emdash";

export interface Dishes {
  id: string;
  slug: string | null;
  status: string;
  title: string;
  category?: string;
  description?: string;
  image?: { id: string; src?: string; alt?: string; width?: number; height?: number; blurhash?: string };
  tags?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

export interface Education {
  id: string;
  slug: string | null;
  status: string;
  title: string;
  year?: string;
  place?: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

export interface Hobbies {
  id: string;
  slug: string | null;
  status: string;
  title: string;
  note?: string;
  image?: { id: string; src?: string; alt?: string; width?: number; height?: number; blurhash?: string };
  placeholder?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

export interface News {
  id: string;
  slug: string | null;
  status: string;
  title: string;
  publication?: string;
  date?: string;
  body?: string;
  tag?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

export interface Offers {
  id: string;
  slug: string | null;
  status: string;
  title: string;
  lead?: string;
  body?: string;
  cta_text?: string;
  image?: { id: string; src?: string; alt?: string; width?: number; height?: number; blurhash?: string };
  featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

export interface Pages {
  id: string;
  slug: string | null;
  status: string;
  title: string;
  content?: PortableTextBlock[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

export interface Posts {
  id: string;
  slug: string | null;
  status: string;
  title: string;
  featured_image?: { id: string; src?: string; alt?: string; width?: number; height?: number; blurhash?: string };
  content?: PortableTextBlock[];
  excerpt?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

export interface Qualifications {
  id: string;
  slug: string | null;
  status: string;
  title: string;
  kind?: string;
  year?: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

export interface Stations {
  id: string;
  slug: string | null;
  status: string;
  title: string;
  year?: string;
  place?: string;
  role?: string;
  awards?: string;
  body?: string;
  image?: { id: string; src?: string; alt?: string; width?: number; height?: number; blurhash?: string };
  current?: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

declare module "emdash" {
  interface EmDashCollections {
    dishes: Dishes;
    education: Education;
    hobbies: Hobbies;
    news: News;
    offers: Offers;
    pages: Pages;
    posts: Posts;
    qualifications: Qualifications;
    stations: Stations;
  }
}
