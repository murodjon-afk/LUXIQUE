
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Header from "@/components/header";
import ScrollToTopButton from "@/components/scrollbtn";
import { ModalProvider } from "../components/ModalProvider";
import DeliveryModal from "../components/DeliveryModal";
import ContactsModal from "@/components/cantact";
import AboutModal from "@/components/about";
import SessionProvider from "../components/SessionProvider";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions"; 
import { headers } from "next/headers";
import { Toaster } from "sonner";
import SignInAdminModal from '../components/SignInAdminModal'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LUXIQUE",
  description: "Онлайн магазин — покупайте не товар, а качество.",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" }
    ],
  },
};



export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const headersList = await headers();
  const pathname = headersList.get("x-invoke-path") || headersList.get("referer") || "";
  const isSignInPage = pathname.includes("/api/auth/signin");
 
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider session={session}>
          {isSignInPage ? (
            <>{children}</>
          ) : (
            <ModalProvider>
              <Header />
              <DeliveryModal />
                         <SignInAdminModal />

              <AboutModal />
              <ContactsModal />
              {children}
              <Toaster position="top-center" richColors />
              <ScrollToTopButton />
              <Footer />
            </ModalProvider>
          )}
        </SessionProvider>
      </body>
    </html>
  );
}
