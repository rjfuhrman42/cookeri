import type { Metadata } from "next";
import { Gluten, League_Spartan } from "next/font/google";
import "./globals.css";

const gluten = Gluten({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-gluten",
});

const league_spartan = League_Spartan({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-league-spartan",
});

export const metadata: Metadata = {
  title: "Cookeri",
  description: "Import Recipes from the web, save, and cook.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${gluten.variable} ${league_spartan.variable}`}>
      <body>{children}</body>
    </html>
  );
}
