import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: unknown
  }

  interface JWT {
    accessToken?: unknown
  }
}