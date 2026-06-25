import { Bot, Mail, LineChart, Shield } from 'lucide-react';

const features = [
  {
    name: 'AI Lead Classification',
    description: 'Automatically categorize and prioritize leads using Google Gemini AI based on their requirements.',
    icon: Bot,
  },
  {
    name: 'Automated Tracked Emails',
    description: 'Send personalized follow-up emails instantly. Track opens and link clicks invisibly.',
    icon: Mail,
  },
  {
    name: 'Advanced Analytics',
    description: 'Visualize your lead funnel, open rates, and click-through rates with beautiful interactive charts.',
    icon: LineChart,
  },
  {
    name: 'Secure & Scalable',
    description: 'Built with Django and Next.js. JWT authentication and role-based access control out of the box.',
    icon: Shield,
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to close deals</h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            LeadMan AI provides a complete toolkit to manage your inbound pipeline.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.name} className="relative p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 mb-4">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
