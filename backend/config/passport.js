import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import prisma from "../db/prisma.js";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findFirst({ where: { username } });
      if (!user) return done(null, false, { message: "Incorrect username" });

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
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
    const user = await prisma.user.findFirst({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
