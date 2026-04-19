import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GitHubStrategy } from "passport-github2";
import bcrypt from "bcryptjs";
import { usersModel } from "../models/usersModel.js";

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await usersModel.findOne({ email });
        if (!user || !user.password)
          return done(null, false, { message: "Incorrect email or password" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect email or password" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/github/callback`,
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await usersModel.findOne({
          githubId: profile.id.toString(),
        });
        if (user) return done(null, user);

        const primaryEmail = profile.emails?.[0]?.value;
        if (primaryEmail) {
          user = await usersModel.findOne({ email: primaryEmail });
          if (user) {
            user = await usersModel.update(
              { id: user.id },
              { githubId: profile.id.toString() },
            );
            return done(null, user);
          }
        }

        user = await usersModel.create({
          email: primaryEmail,
          githubId: profile.id.toString(),
        });
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  try {
    done(null, user.id);
  } catch (err) {
    done(err);
  }
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await usersModel.findOne({ id });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export { passport };
