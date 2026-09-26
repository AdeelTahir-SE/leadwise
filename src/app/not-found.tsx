import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RobotMascot from "@/components/RobotMascot";
import { ArrowLeft, MessageSquare, Home as HomeIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full text-center">
          
          {/* 404 Robot Mascot with Disconnected Cable Illustration */}
          <div className="flex justify-center mb-6">
            <RobotMascot variant="not-found" size={260} />
          </div>

          {/* 404 Number Badge */}
          <div className="text-6xl sm:text-7xl font-black text-slate-900 tracking-tight mb-2">
            4<span className="text-[#FF5A36]">0</span>4
          </div>

          {/* Heading matching design Section 11 */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
            Page Not Found
          </h1>

          {/* Subtitle matching design Section 11 */}
          <p className="text-base text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          {/* Action Buttons matching design Section 11 */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-[#FF5A36] hover:bg-[#E84D2B] transition-all shadow-md shadow-orange-500/20 active:scale-95"
            >
              <HomeIcon className="w-4 h-4" />
              <span>Go Back Home</span>
            </Link>

            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all hover:border-slate-300"
            >
              <MessageSquare className="w-4 h-4 text-slate-500" />
              <span>Contact Support</span>
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
