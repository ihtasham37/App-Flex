import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { GlassCard } from '../../components/ui/GlassCard';
import { Download, User, Package, Calendar, Search } from 'lucide-react';
import { Input } from '../../components/ui/Input';

export default function AdminDownloads() {
  const [downloads, setDownloads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchDownloads() {
      try {
        const q = query(collection(db, 'downloads'), orderBy('downloadedAt', 'desc'), limit(100));
        const snap = await getDocs(q);
        setDownloads(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching downloads:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDownloads();
  }, []);

  const filtered = downloads.filter(d => 
    d.appName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-gray-900">Download Activity</h1>
        <p className="text-sm text-gray-500 font-medium">Global history of all applications downloaded by users.</p>
      </div>

      <GlassCard className="p-6 border-none shadow-xl" hover={false}>
        <div className="mb-8">
          <Input 
            placeholder="Search by app name or user ID..."
            icon={<Search size={20} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-50 border-none rounded-2xl max-w-md"
          />
        </div>

        {loading ? (
          <div className="py-20 text-center font-bold animate-pulse text-gray-400">Loading activity logs...</div>
        ) : (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Application</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">User ID</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date & Time</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((dl) => (
                  <tr key={dl.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                          <Package size={16} />
                        </div>
                        <span className="font-bold text-gray-900">{dl.appName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-mono">{dl.userId}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                        <Calendar size={14} />
                        {dl.downloadedAt?.toDate ? dl.downloadedAt.toDate().toLocaleString() : 'Just now'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <span className="px-2 py-1 bg-green-100 text-green-600 rounded-lg text-[10px] font-black uppercase">
                         Redirected
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
