import mongoose, { Schema, model, models } from "mongoose";

// ✅ USER
const UserSchema = new Schema({
  email: String,
  password: String,
  role: { type: String, default: "client" },
});

export const User =
  models.User || model("User", UserSchema);

// ✅ ATHLETE
const AthleteSchema = new Schema({
  name: String,
  sport: String,
  teamId: String,
});

export const Athlete =
  models.Athlete || model("Athlete", AthleteSchema);

// ✅ SESSION
const SessionSchema = new Schema({
  athleteId: String,
  type: String,
  duration: Number,
  day: String,
  hour: String,
});

export const Session =
  models.Session || model("Session", SessionSchema);

// ✅ TEAM
const TeamSchema = new Schema({
  name: String,
});

export const Team =
  models.Team || model("Team", TeamSchema);

// ✅ CLIENT PROFILE
const ClientProfileSchema = new Schema(
  {
    userId: String,
    name: String,
    email: String,
    age: String,
    goal: String,
    activity: String,
  },
  {
    timestamps: true,
  }
);

export const ClientProfile =
  models.ClientProfile || model("ClientProfile", ClientProfileSchema);

// ✅ CLIENT METRIC
const ClientMetricSchema = new Schema(
  {
    userId: String,
    weight: Number,
    height: Number,
    bmi: Number,
    calories: Number,
    goal: String,
    activity: String,
    date: String,
  },
  {
    timestamps: true,
  }
);

export const ClientMetric =
  models.ClientMetric || model("ClientMetric", ClientMetricSchema);

// ✅ CLIENT PHOTO
const ClientPhotoSchema = new Schema(
  {
    userId: String,
    image: String,
    goal: String,
    score: Number,
    feedback: String,
    date: String,
  },
  {
    timestamps: true,
  }
);

export const ClientPhoto =
  models.ClientPhoto || model("ClientPhoto", ClientPhotoSchema);
