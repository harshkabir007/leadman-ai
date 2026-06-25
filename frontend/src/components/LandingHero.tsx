import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function LandingHero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-950 -z-10" />
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
          Manage Leads with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">AI Precision</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 mb-10">
          LeadMan AI automatically classifies incoming inquiries, sends personalized tracking emails, and gives you actionable analytics in a beautiful dashboard.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="#contact" className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition-all shadow-lg hover:shadow-indigo-500/30">
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link href="/login" className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full transition-all">
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}
