"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Loader2, Search, Trash2, Eye, Download, ChevronLeft, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  requirement: string;
  category: string;
  priority: string;
  opened: boolean;
  clicked: boolean;
  submitted_at: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/leads/?page=${page}&search=${search}`);
      if (res.data.results) {
        setLeads(res.data.results);
        setTotalPages(Math.ceil(res.data.count / 10)); // Assuming 10 per page
      } else {
        // If not using pagination strictly or testing
        setLeads(Array.isArray(res.data) ? res.data : []);
        setTotalPages(1);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const deleteLead = async (id: number) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      await api.delete(`/leads/${id}/`);
      toast.success('Lead deleted successfully');
      fetchLeads();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete lead');
    }
  };

  const exportCSV = () => {
    // Simple client side export or trigger backend export
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/leads/export_csv/`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads Management</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">View and manage all incoming leads.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search leads..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm w-full sm:w-64"
            />
          </div>
          <button onClick={exportCSV} className="flex items-center justify-center px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium text-sm rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors border border-indigo-100 dark:border-indigo-800">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Classification</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="animate-spin text-indigo-600 w-8 h-8 mx-auto" />
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No leads found matching your criteria.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{lead.name}</div>
                          <div className="text-sm text-gray-500">{lead.email}</div>
                          {lead.company && <div className="text-xs text-gray-400 mt-0.5">{lead.company}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1.5">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 w-fit">
                          {lead.category || 'Uncategorized'}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${
                          lead.priority === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                          lead.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                          'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        }`}>
                          {lead.priority || 'Low'} Priority
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1.5 text-sm">
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-500 w-12">Opened:</span>
                          {lead.opened ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-gray-300 dark:text-gray-600" />}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-500 w-12">Clicked:</span>
                          {lead.clicked ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-gray-300 dark:text-gray-600" />}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(lead.submitted_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => setSelectedLead(lead)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4">
                        <Eye className="w-5 h-5 inline" />
                      </button>
                      <button onClick={() => deleteLead(lead.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        <Trash2 className="w-5 h-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white dark:bg-gray-900 px-4 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">Previous</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">Next</button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Lead Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <h3 className="text-lg font-bold">Lead Details</h3>
              <button onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-gray-500 uppercase font-semibold">Name</label>
                  <p className="font-medium mt-1">{selectedLead.name}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase font-semibold">Email</label>
                  <p className="font-medium mt-1"><a href={`mailto:${selectedLead.email}`} className="text-indigo-600 hover:underline">{selectedLead.email}</a></p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase font-semibold">Phone</label>
                  <p className="font-medium mt-1">{selectedLead.phone}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase font-semibold">Company</label>
                  <p className="font-medium mt-1">{selectedLead.company || 'N/A'}</p>
                </div>
              </div>
              
              <div>
                <label className="text-xs text-gray-500 uppercase font-semibold">Requirement</label>
                <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-sm whitespace-pre-wrap">
                  {selectedLead.requirement}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div>
                  <label className="text-xs text-gray-500 uppercase font-semibold">AI Category</label>
                  <p className="font-medium mt-1">{selectedLead.category}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase font-semibold">AI Priority</label>
                  <p className="font-medium mt-1">{selectedLead.priority}</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 flex justify-end">
              <button onClick={() => setSelectedLead(null)} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
