import LandingHero from '@/components/LandingHero';
import Features from '@/components/Features';
import ContactForm from '@/components/ContactForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">
      <nav className="fixed w-full z-50 glass-dark bg-white/70 dark:bg-gray-950/70 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="font-bold text-xl tracking-tight">LeadMan AI</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 text-sm font-medium transition-colors">Features</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 text-sm font-medium transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </nav>
      <main className="pt-16">
        <LandingHero />
        <Features />
        <ContactForm />
      </main>
      <footer className="py-12 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} LeadMan AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
