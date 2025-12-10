export const CATEGORIES = [
  { name: "Ayakkabı",     slug: "ayakkabi" },
  { name: "Giyim",        slug: "giyim" },
  { name: "Elektronik",   slug: "elektronik" },
  { name: "Aksesuar",     slug: "aksesuar" },
  { name: "Çanta",        slug: "canta" },
  { name: "Kişisel Bakım", slug: "kisisel-bakim" },
  { name: "Mobilya",      slug: "mobilya" },
  { name: "Kırtasiye",    slug: "kirtasiye" },
  { name: "Gıda",         slug: "gida" },
  { name: "Oyuncak",      slug: "oyuncak" },
] as const;

export const VALID_CATEGORY_NAMES = CATEGORIES.map(c => c.name);