import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Anime 2D Scorekeeper',
  description: 'Ứng dụng đếm điểm game Anime 2D tối ưu hóa cho iPad Tabletop & Desktop, tích hợp vòng quay chọn người bắt đầu và cơ chế rung chuông battle.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
