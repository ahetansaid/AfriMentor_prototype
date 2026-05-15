import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AfriMentor — Le savoir qui se transmet",
    short_name: "AfriMentor",
    description:
      "Plateforme des pionniers d'Afrique francophone — préserver, connecter, propulser.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF6EE",
    theme_color: "#1A2F4E",
    orientation: "portrait",
    categories: ["education", "productivity", "social"],
    lang: "fr",
  };
}
