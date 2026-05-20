import mongoose, { Schema, model, models } from "mongoose";

// ? USER
const UserSchema = new Schema({
  email: String,
  password: String,
  role: { type: String, default: "client" },
  role: { type: String, default: "user" },
});

export const User =
  models.User || model("User", UserSchema);

// ? ATHLETE
const AthleteSchema = new Schema({
  name: String,
  sport: String,
  teamId: String,
});

export const Athlete =
  models.Athlete || model("Athlete", AthleteSchema);

// ? SESSION
const SessionSchema = new Schema({
  athleteId: String,
  type: String,
  duration: Number,
  day: String,
  hour: String,
});

export const Session =
  models.Session || model("Session", SessionSchema);

// ? TEAM
const TeamSchema = new Schema({
  name: String,
});

export const Team =
  models.Team || model("Team", TeamSchema);

const ClientProfileSchema = new mongoose.Schema({
  userId: String,
  poids: Number,
  taille: Number,
  bmi: Number,
  condition: String,
  bodyType: String,
  goal: String,
  diet: String,
  workout: String,
});

export const ClientProfile =
  models.ClientProfile || model("ClientProfile", ClientProfileSchema);
