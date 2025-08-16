import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import Provider from "./providers";
import { isAuthenticated } from "@/lib/auth";
import { Container, CssBaseline } from "@mui/material";

const jost = Jost({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"]
});

export const metadata: Metadata = {
  title: "Note Taking App",
  description: "Note Taking Application",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isUserAuthenticated = await isAuthenticated();
  return (
    <html lang="en">
      <body
        className={`${jost.variable} antialiased`}
      >
        <Provider isAuthenticated={isUserAuthenticated}>
          <CssBaseline/>
          <Container>{children}</Container>
        </Provider>
      </body>
    </html>
  );
}
