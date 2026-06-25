"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import { Send, Loader2 } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  company: z.string().optional(),
  requirement: z.string().min(10, "Please provide more details about your requirement"),
});

type FormData = z.infer<typeof schema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await api.post('/leads/', data);
      setIsSuccess(true);
      toast.success('Thank you! Your request has been submitted successfully.');
      reset();
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit request. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24" id="contact">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="p-8 sm:p-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">Let&apos;s build something great</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Fill out the form below and our AI will immediately process your request and connect you with the right team.
              </p>
            </div>
            
            {isSuccess ? (
              <div className="text-center py-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Send className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Request Submitted!</h3>
                <p className="text-indigo-600 dark:text-indigo-400 max-w-md mx-auto">
                  Thank you for contacting LeadMan AI. Your request has been submitted successfully and an automated email is on its way.
                </p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="mt-8 text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <input 
                      {...register('name')}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                    <input 
                      {...register('email')}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <input 
                      {...register('phone')}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="+1 (555) 000-0000"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Company Name</label>
                    <input 
                      {...register('company')}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="Acme Corp (Optional)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Requirement / Message *</label>
                  <textarea 
                    {...register('requirement')}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                    placeholder="Tell us about your project, tech stack, and goals..."
                  ></textarea>
                  {errors.requirement && <p className="text-red-500 text-xs mt-1">{errors.requirement.message}</p>}
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center py-4 px-8 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                      Processing...
                    </>
                  ) : 'Submit Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
