import { useEffect } from "react";

interface SEOMeta {
  title: string;
  description?: string;
  image?: string;
  type?: "article" | "website";
}

const setMeta = (name: string, content: string, prop = false) => {
  const attr = prop ? "property" : "name";
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const useSEO = ({ title, description, image, type = "website" }: SEOMeta) => {
  useEffect(() => {
    document.title = title;
    if (description) {
      setMeta("description", description);
      setMeta("og:description", description, true);
      setMeta("twitter:description", description);
    }
    if (image) {
      setMeta("og:image", image, true);
      setMeta("twitter:image", image);
    }
    setMeta("og:title", title, true);
    setMeta("og:type", type, true);
    setMeta("twitter:title", title);
  }, [title, description, image, type]);
};

export default useSEO;
