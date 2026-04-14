import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { usersModel } from "../models/usersModel.js";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await usersModel.findOne({ username });
      if (!user)
        return done(null, false, { message: "Incorrect username or password" });

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect username or password" });
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
    const user = await usersModel.findOne({ id });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export { passport };
