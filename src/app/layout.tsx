import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const xilosa = localFont({
  src: "../../public/fonts/xilosa_.ttf",
  variable: "--font-xilosa",
});

export const metadata: Metadata = {
  title: "Xaxado CRM",
  description: "CRM modular, simples e intuitivo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full bg-sertao-bg dark">
      <body className={`${inter.className} ${xilosa.variable} h-full text-sertao-text overflow-hidden bg-sertao-bg`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
