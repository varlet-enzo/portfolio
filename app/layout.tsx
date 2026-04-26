import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans, Share_Tech_Mono } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dmsans",
  display: "swap",
});

const shareTechMono = Share_Tech_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sharetech",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Enzo Varlet — Game Developer | Portfolio",
  description:
    "Portfolio de Enzo Varlet, étudiant en Game Design à la recherche d'une alternance. Spécialisé Unity, Unreal Engine 5, C#, C++, Level Design et Gameplay Programming.",
  keywords: [
    "game developer",
    "Unity",
    "Unreal Engine",
    "game design",
    "alternance",
    "stage",
    "portfolio",
    "C#",
    "level design",
    "gameplay programmer",
  ],
  authors: [{ name: "Enzo Varlet" }],
  openGraph: {
    title: "Enzo Varlet — Game Developer | Portfolio",
    description:
      "Étudiant en Game Design à la recherche d'une alternance. Unity, UE5, C#, Level Design.",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Enzo Varlet — Game Developer | Portfolio",
    description: "Étudiant en Game Design · Unity · UE5 · Alternance 2024",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${bebasNeue.variable} ${dmSans.variable} ${shareTechMono.variable}`}
    >
      <body className="antialiased font-body bg-bg-primary text-text-primary">
        {children}
      </body>
    </html>
  );
}
