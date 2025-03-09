import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    is_hr: boolean;
    accessToken: string;
  }

  interface Session {
    accessToken?: string;
    user: {
      id: string;
      email: string;
      first_name: string;
      last_name: string;
      is_hr: boolean;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    is_hr: boolean;
    accessToken: string;
  }
} 