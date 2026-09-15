import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const neueRemanGt = localFont({
  src: [
    {
      path: "../public/fonts/NeueRemanGt-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/NeueRemanGt-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/NeueRemanGt-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/NeueRemanGt-Expanded.otf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-neue-reman",
});

export const metadata: Metadata = {
  title: "52 Años de Grupo Tritech | 52 Palabras que Mueven a Tritech",
  description:
    "Plataforma web conmemorativa del 52 Aniversario de Grupo Tritech. Genera tu insignia digital oficial, comparte tu palabra clave y celebra más de cinco décadas de liderazgo industrial.",
  keywords: ["Grupo Tritech", "52 Aniversario", "Insignia Tritech", "Industria", "52 Palabras"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${neueRemanGt.variable} dark scroll-smooth`}>
      <body className="bg-[#040817] text-slate-100 min-h-screen flex flex-col font-sans selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
