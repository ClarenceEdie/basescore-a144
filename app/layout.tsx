import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "BaseScore",
  description: "BaseScore",
  other: {
    "base:app_id": "69ca39f954fba99e37411022",
    "base:builder_code": "0x62635f6d6f786765766f720b0080218021802180218021802180218021",
    "base:builder_code_string": "bc_moxgevor",
    "base:code_encode_string": "bc_moxgevor",
    "build:code": "0x62635f6d6f786765766f720b0080218021802180218021802180218021",
    "encoded:string": "bc_moxgevor",
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
