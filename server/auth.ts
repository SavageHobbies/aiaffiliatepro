import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { storage } from './storage';
import crypto from 'crypto';
import { sessions } from '../shared/schema';
import connectPg from 'connect-pg-simple';
import session from 'express-session';

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth environment variables");
}

const pgSession = connectPg(session);

passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  try {
    const user = await storage.getUserByEmail(email);
    if (!user) {
      return done(null, false, { message: 'Incorrect email or password.' });
    }

    if (!user.salt) {
      return done(null, false, { message: 'Incorrect email or password.' });
    }
    const hashedPassword = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex');
    if (hashedPassword !== user.hashedPassword) {
      return done(null, false, { message: 'Incorrect email or password.' });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  async function(accessToken: string, refreshToken: string, profile: any, cb: (err: any, user?: any) => void) {
    const user = await storage.upsertUser({
      id: profile.id,
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      profileImageUrl: profile.photos[0].value,
    });
    return cb(null, user);
  }
));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export const sessionMiddleware = session({
  store: new pgSession({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    tableName: 'sessions',
  }),
  secret: process.env.SESSION_SECRET || 'a-secret-key-for-development',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  },
});

import { Request, Response, NextFunction } from 'express';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};
