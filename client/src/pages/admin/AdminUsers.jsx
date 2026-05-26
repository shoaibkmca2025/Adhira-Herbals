import { useEffect, useState } from 'react';
import { adminApi } from '../../api/endpoints.js';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { users } = await adminApi.users.list();
    setUsers(users);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function changeRole(id, role) {
    try {
      await adminApi.users.updateRole(id, role);
      toast.success(`Role set to ${role}`);
      load();
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-forest-700">Customers</h1>
      <div className="mt-6 bg-white border border-forest-600/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream-200/50 text-forest-700/70 text-xs uppercase tracking-wider-2">
            <tr>
              <th className="text-left px-5 py-3">Name</th>
              <th className="text-left px-5 py-3">Email</th>
              <th className="text-left px-5 py-3">Joined</th>
              <th className="text-left px-5 py-3">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-600/10">
            {loading && (
              <tr><td colSpan={4} className="p-8 text-center text-forest-700/60">Loading…</td></tr>
            )}
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-5 py-3 font-medium text-forest-700">{u.name}</td>
                <td className="px-5 py-3 text-forest-700/80">{u.email}</td>
                <td className="px-5 py-3 text-forest-700/60">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-3">
                  <select
                    value={u.role}
                    onChange={(e) => changeRole(u.id, e.target.value)}
                    className="text-xs border border-forest-600/15 rounded-md px-2 py-1 bg-white"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
