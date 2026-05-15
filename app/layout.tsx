import type { Metadata } from "next";
import { Fraunces, Inter_Tight } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getCurrentUser } from "@/lib/session";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AfriMentor — Le savoir qui se transmet",
    template: "%s · AfriMentor",
  },
  description:
    "AfriMentor préserve, connecte et propulse le patrimoine intellectuel des pionniers d'Afrique. Une bibliothèque vivante construite par les pionniers eux-mêmes.",
  metadataBase: new URL("https://afrimentor.vercel.app"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "AfriMentor",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html
      lang="fr"
      className={`${fraunces.variable} ${interTight.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[100] focus-visible:rounded-sm focus-visible:bg-indigo focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-ivory"
        >
          Aller au contenu principal
        </a>
        <Navbar user={user ? { prenom: user.prenom } : null} />
        <main id="main" className="animate-fade-in flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
