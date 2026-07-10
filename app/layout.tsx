import type { Metadata } from "next";
import "./globals.css";
import "./reset.css";
import Header from "./components/layout/Header";
import Providers from "./providers";
import AuthGate from './components/auth/AuthGate'
import Toast from './components/toast/Toast'
import ConfirmModal from './components/confirm/ConfirmModal'

export const metadata: Metadata = {
  icons: {
    icon: "/favicon-32x32.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Providers>
            <AuthGate>
            <Header></Header>
            {children}
            </AuthGate>
            <Toast />
            <ConfirmModal />
        </Providers>
        </body>
    </html>
  );
}
