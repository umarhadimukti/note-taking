import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import Provider from "./providers";
import { Container, CssBaseline } from "@mui/material";
import { cookies } from "next/headers";

const jost = Jost({
  variable: "--font-jost",
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
  const cookieStore = await cookies();
  const isUserAuthenticated = !!cookieStore.get("user-session")?.value;
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
