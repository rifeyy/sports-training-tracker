"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* HERO */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 text-center">

        <div className="max-w-3xl">

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            AthleteOS
          </h1>

          <p className="text-gray-400 text-lg mb-8">
            A smart fitness and sports training platform for admins, coaches and clients.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">

            <Link
              href="/login"
              className="bg-green-500 hover:bg-green-400 text-black px-6 py-3 rounded-xl font-semibold transition"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="border border-gray-700 hover:border-green-400 px-6 py-3 rounded-xl font-semibold transition"
            >
              Create Account
            </Link>

          </div>

        </div>

      </section>

      {/* FEATURES */}
      <section className="px-6 pb-16">

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">

          <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-3">
              Admin Dashboard
            </h2>
            <p className="text-gray-400">
              Manage clients, athletes, teams, sessions, planning and statistics from one place.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-3">
              Client Dashboard
            </h2>
            <p className="text-gray-400">
              Track weight, BMI, calories, progress photos, recommendations and reports.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-3">
              Smart Progress
            </h2>
            <p className="text-gray-400">
              Visualize progress with charts, history, goals and MongoDB saved data.
            </p>
          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-900 py-6 text-center text-gray-500 text-sm">
        © 2026 AthleteOS. All rights reserved.
      </footer>

    </div>
  );
}