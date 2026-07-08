import "./globals.css";
import "./reset.css";
import Header from "./components/layout/Header";
import Providers from "./providers";
import AuthGate from './components/auth/AuthGate'
import Toast from './components/toast/Toast'
import ConfirmModal from './components/confirm/ConfirmModal'



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
