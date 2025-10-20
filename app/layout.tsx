export const metadata = {
  title: "3D Pony Petting Zoo",
  description: "Pet cute 3D ponies in your browser!",
};

import "./globals.css";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
