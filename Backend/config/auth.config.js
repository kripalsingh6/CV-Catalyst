import passport from "passport";
import LocalStrategy from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GithubStrategy } from "passport-github2";
import User from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();

// 1. Local Strategy (Email & Password)
passport.use(
  new LocalStrategy({ usernameField: "email" }, User.authenticate())
);

// 2. Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const name = profile.displayName || profile.name?.givenName || "Google User";
          const avatar = profile.photos?.[0]?.value || "";

          // 1. Check if user already exists by googleId
          let existingUser = await User.findOne({ googleId: profile.id });
          if (existingUser) {
            return done(null, existingUser);
          }

          // 2. Link account if user with same email exists
          if (email) {
            existingUser = await User.findOne({ email });
            if (existingUser) {
              existingUser.googleId = profile.id;
              if (!existingUser.avatar) existingUser.avatar = avatar;
              await existingUser.save();
              return done(null, existingUser);
            }
          }

          // 3. Create new user
          const newUser = await User.create({
            googleId: profile.id,
            name,
            email: email || `${profile.id}@google.oauth`,
            avatar,
          });

          return done(null, newUser);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
} else {
  console.warn("⚠️ GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET missing in .env. Google login disabled.");
}

// GitHub Strategy
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "/api/auth/github/callback",
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const name = profile.displayName || profile.username || "GitHub User";
          const avatar = profile.photos?.[0]?.value || "";

          // 1. Check if user exists by githubId
          let existingUser = await User.findOne({ githubId: profile.id });
          if (existingUser) {
            return done(null, existingUser);
          }

          // 2. Link account if user with same email exists
          if (email) {
            existingUser = await User.findOne({ email });
            if (existingUser) {
              existingUser.githubId = profile.id;
              if (!existingUser.avatar) existingUser.avatar = avatar;
              await existingUser.save();
              return done(null, existingUser);
            }
          }

          // 3. Create new user
          const newUser = await User.create({
            githubId: profile.id,
            name,
            email: email || `${profile.username}@github.oauth`,
            avatar,
          });

          return done(null, newUser);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
} else {
  console.warn("⚠️ GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET missing in .env. GitHub login disabled.");
}

// Unified Serialization
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
