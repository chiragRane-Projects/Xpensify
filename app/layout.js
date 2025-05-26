import { Poppins } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/Providers/Session-Providers";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata = {
  title: "Xpensify - Expense Tracker",
  description: "Track your spending, manage your budget, and stay financially sharp.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.className} suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" />
      </head>
      <body>
        <SessionProvider>
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
