import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Enzo Varlet — Game Developer",
    short_name: "EV Portfolio",
    description: "Portfolio game dev — Unity, UE5, Godot",
    start_url: "/",
    display: "standalone",
    background_color: "#080B10",
    theme_color: "#E8FF47",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
