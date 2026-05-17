import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

/**
 * Centralized NextAuth configuration.
 * Exported separately so it can be shared between the route handler
 * and any server-side `getServerSession()` calls.
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase().trim() },
          });

          if (!user) {
            return null;
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.hashedPassword
          );

          if (!isPasswordValid) {
            return null;
          }

          // Return user object (this becomes the JWT token payload)
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error('[AUTH_ERROR]', error);
          return null;
        }
      },
    }),
  ],

  // Use JWT strategy (stateless — no session table needed)
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    // Include user.id in the JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    // Expose user.id in the client-side session
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },

  // Don't set custom pages for error — let NextAuth handle it internally.
  // We intercept errors client-side via `redirect: false` in signIn().

  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === 'development',
};
