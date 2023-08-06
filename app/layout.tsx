import "./globals.css";
import "antd/dist/antd.min.css";

export const metadata = {
  title: "JimGerace Blog",
  description: "JimGerace Blog",
};

export const revalidate = 60 * 60;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
      <meta name="referrer" content="no-referrer" />
    </html>
  );
}
