import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import * as usersModel from "../models/usersModel.js";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await usersModel.find({ username });
      if (!user) return done(null, false, { message: "Incorrect username" });

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }

      if (!user.isEmailConfirmed) {
        return done(null, false, { message: "Email not confirmed" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
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
    const user = await usersModel.find({ id });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
