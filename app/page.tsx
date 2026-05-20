"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center text-center px-6">

      {/* ✅ HERO */}
      <div className="flex flex-col items-center justify-center flex-1">

        <h1 className="text-5xl font-bold mb-6">
          ⚡ AthleteOS
        </h1>

        <p className="text-gray-400 mb-8 max-w-xl">
          Manage your athletes, sessions and performance in one powerful dashboard.
        </p>

        <div className="flex gap-4 mb-20">

          <Link href="/register" className="bg-green-500 px-6 py-3 rounded-lg">
            Get Started
          </Link>

          <Link href="/login" className="border border-gray-600 px-6 py-3 rounded-lg">
            Login
          </Link>

        </div>

        {/* ✅ FEATURES */}
        <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl">

          <div className="bg-gray-900 p-6 rounded-xl">
            <h3 className="font-bold mb-2">📊 Analytics</h3>
            <p className="text-gray-400 text-sm">
              Track sessions & performance
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl">
            <h3 className="font-bold mb-2">📅 Planning</h3>
            <p className="text-gray-400 text-sm">
              Weekly calendar with drag & drop
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl">
            <h3 className="font-bold mb-2">👥 Teams</h3>
            <p className="text-gray-400 text-sm">
              Organize athletes efficiently
            </p>
          </div>

        </div>

        {/* ✅ CTA */}
        <div className="mt-20">

          <h2 className="text-3xl mb-4">
            Start managing like a pro 🚀
          </h2>

          <Link href="/register" className="bg-blue-500 px-6 py-3 rounded-lg">
            Create Account
          </Link>

        </div>

      </div>

      {/* ✅ FOOTER CLEAN */}
      <footer className="w-full border-t border-gray-800 py-6 text-center text-sm text-gray-500">

        <p>© 2026 AthleteOS. All rights reserved.</p>

        <div className="flex justify-center gap-6 mt-2">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Contact</span>
        </div>

      </footer>

    </div>
  );
}
