import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "BaseScore",
  description: "BaseScore",
  other: {
    "base:app_id": "69ca39f954fba99e37411022",
    "talentapp:project_verification":
      "d45b3098e8d0ffc9a33d8181e91ba588d7fdf41c855f306f128cf8199688b3869fece841b383b65b7ecbc864fbb0633edef2e78df730a3bbc24bbe2dce81d521",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

