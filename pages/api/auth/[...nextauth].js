import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import AppleProvider from "next-auth/providers/apple";

export default NextAuth({
  debug: true,   // ← logs every step to console/server

  // ── Providers ────────────────────────────────────
  providers: [
    // 1) Email & Password
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email:    { label: "Email",    type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(
          "https://admin.xpertbid.com/api/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email:    credentials.email,
              password: credentials.password,
            }),
          }
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Login failed");
        }
        // Laravel se user + token wapas milta
        return { ...data.user, token: data.token };
      },
    }),
    // 2) Google One-Taps
    CredentialsProvider({
      id: "google-tap",
      name: "Google Tap",
      credentials: {
        token: { label: "Access Token", type: "text" },
      },
      async authorize(credentials) {
        // 1) credentials.token lo
        const accessToken = credentials.token;
        if (!accessToken) return null;

        // 2) Laravel /api/google-login ko POST karo
        const res = await fetch("https://admin.xpertbid.com/api/google-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: accessToken }),
        });

        let data;
        try {
          data = await res.json();
          console.log("Laravel Google-login succeeded:", data);
        } catch {
          if(res.status===403) throw new Error('closed');

          console.error("Laravel returned non-JSON");
          return null;
        }

        if (!res.ok) {
          console.error("Laravel Google-login failed:", data.error || data.message);
          return null;
        }
        // 3) Success me user+token wapas karo
        return { ...data.user, token: data.token };
      },
    }),

    // 3) Sign in with Apple
    AppleProvider({
      clientId:     process.env.APPLE_CLIENT_ID,
      clientSecret: process.env.APPLE_CLIENT_SECRET,
    }),
  ],


  // ── Session & Cookie (1 day expiry) ───────────────────────
  session: {
    strategy: "jwt",
    maxAge:   24 * 60 * 60,    // 1 day
    updateAge: 24 * 60 * 60,   // rotate token every 24h
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60,
      },
    },
  },
  


  // ── Callbacks ───────────────────────────────────────────────
  callbacks: {
    // jwt: user/account info token mein merge
    async jwt({ token, user, account }) {
      if (user) {
        token.id     = user.id;
        token.name   = user.name;
        token.email  = user.email;
        token.avatar = user.avatar;
        token.token  = user.token;    // Laravel personal access token
      }
      if (account) {
        token.provider     = account.provider;
        token.accessToken  = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },

    // session: client-side pe session.user expose karo
    async session({ session, token }) {
      session.user = {
        id:           token.id,
        name:         token.name,
        email:        token.email,
        avatar:       token.avatar,
        token:        token.token,
        provider:     token.provider,
        accessToken:  token.accessToken,
        refreshToken: token.refreshToken,
      };
      // optional: client ko expire waqt dikhane ke liye
      session.expires = new Date(Date.now() + 24*60*60*1000).toISOString();
      console.log(session);
      return session;
    },
  },

  // ── Secret ──────────────────────────────────────────────────
  secret: process.env.NEXTAUTH_SECRET,
});
