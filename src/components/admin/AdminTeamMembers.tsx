import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Edit3, 
  Trash2, 
  Shield, 
  CheckCircle2, 
  Mail, 
  Phone, 
  Key, 
  Lock,
  RefreshCw,
  MoreVertical,
  Check,
  X
} from 'lucide-react';
import { TeamMember } from '../../types/schema';
import { api } from '../../lib/api';
import { MemberFormModal } from './MemberFormModal';

export const AdminTeamMembers: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const data = await api.getMembers();
      setMembers(data);
    } catch (err) {
      console.error('Failed to fetch team members', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleOpenAdd = () => {
    setSelectedMember(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (mem: TeamMember) => {
    setSelectedMember(mem);
    setIsModalOpen(true);
  };

  const handleSaveMember = async (memberData: Partial<TeamMember>) => {
    if (selectedMember) {
      // Update
      const updated = await api.updateMember(selectedMember.id, memberData);
      setMembers(prev => prev.map(m => m.id === selectedMember.id ? updated : m));
    } else {
      // Create new
      const created = await api.createMember(memberData);
      setMembers(prev => [created, ...prev]);
    }
  };

  const handleDeleteMember = async (id: string, name: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus member "${name}"?`)) {
      return;
    }

    try {
      await api.deleteMember(id);
      setMembers(prev => prev.filter(m => m.id !== id));
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus member.');
    }
  };

  const filteredMembers = members.filter(m => {
    const matchRole = roleFilter === 'ALL' || m.role === roleFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || 
      m.name.toLowerCase().includes(q) || 
      m.email.toLowerCase().includes(q) || 
      m.phone.includes(q);
    return matchRole && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Team Member
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Kelola profil anggota tim, tingkatan peran (Role), dan rincian izin modul sistem.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchMembers}
            className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors border border-slate-200 bg-white"
            title="Segarkan data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#2552df] hover:bg-[#1b43b8] text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Member</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama, email, atau no. telepon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
          {['ALL', 'Super Admin', 'Admin', 'Staff', 'CS', 'Finance'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                roleFilter === r
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r === 'ALL' ? 'Semua Role' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Members List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading && members.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
            <span>Memuat data member...</span>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-800">Tidak ada member ditemukan</p>
            <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau tambahkan member baru.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Member Profile</th>
                  <th className="px-6 py-3.5">Kontak</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Izin Akses Utama</th>
                  <th className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.map((mem) => {
                  const perm = mem.permissions;
                  return (
                    <tr key={mem.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name & Avatar */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                            {mem.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block text-sm">
                              {mem.name}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Terdaftar: {new Date(mem.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-slate-700">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{mem.email}</span>
                        </div>
                        {mem.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{mem.phone}</span>
                          </div>
                        )}
                      </td>

                      {/* Role Badge */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          mem.role === 'Super Admin'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : mem.role === 'Admin'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : mem.role === 'Staff'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {mem.role}
                        </span>
                      </td>

                      {/* Permissions Summary Badges */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {perm?.dashboard?.lihatDashboard && (
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium">Dashboard</span>
                          )}
                          {perm?.semuaOrder?.lihatOrder && (
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-medium">
                              Order ({perm.semuaOrder.scopeOrder === 'SEMUA' ? 'Semua' : 'Assigned'})
                            </span>
                          )}
                          {perm?.tambahProduk?.lihatProduk && (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-medium">Produk</span>
                          )}
                          {perm?.pembayaran?.lihatPembayaran && (
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-[10px] font-medium">Pembayaran</span>
                          )}
                          {perm?.statistik?.lihatStatistik && (
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-medium">Statistik</span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(mem)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                            title="Edit Member & Permission"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMember(mem.id, mem.name)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Hapus Member"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Member Form Modal (matches Screenshot 1) */}
      <MemberFormModal
        isOpen={isModalOpen}
        member={selectedMember}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMember}
      />
    </div>
  );
};
