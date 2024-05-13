import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PrimeReactProvider } from "primereact/api";
import "@/styles/_globals.scss";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import Header from "@/components/Header";
import { getSession } from "@/lib/sessionUtils";
import SessionProvider from "@/providers/SessionProvider";
import ToastProvider from "@/providers/ToastProvider";
import CartProvider from "@/providers/CartProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return (
    <html lang="en">
      <body className={inter.className}>
        <PrimeReactProvider>
          <ToastProvider>
            <SessionProvider session={session}>
              <CartProvider>
                <Header />
                {children}
              </CartProvider>
            </SessionProvider>
          </ToastProvider>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
