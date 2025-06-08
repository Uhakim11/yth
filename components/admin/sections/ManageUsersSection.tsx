import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useAlert } from '../../../hooks/useAlert';
import { User } from '../../../types';
import Button from '../../shared/Button';
import Input from '../../shared/Input';
import Modal from '../../shared/Modal';
import { Users as UsersIconLucide, Search, UserCheck, UserX, ChevronLeft, ChevronRight, ShieldCheck, Edit } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

const ManageUsersSection: React.FC = () => {
  const { fetchAllUsers, updateUserStatusAsAdmin, user: adminUser } = useAuth();
  const { addAlert } = useAlert();
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [userToEdit, setUserToEdit] = useState<User | null>(null); // For future role edit or more details
  const [isSubmittingStatus, setIsSubmittingStatus] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    const fetchedUsers = await fetchAllUsers();
    setUsers(fetchedUsers);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleToggleUserStatus = async (userToUpdate: User) => {
    if (userToUpdate.id === adminUser?.id) {
      addAlert("Admins cannot change their own status.", "warning");
      return;
    }
    const newStatus = userToUpdate.status === 'active' ? 'suspended' : 'active';
    if (window.confirm(`Are you sure you want to set ${userToUpdate.name || userToUpdate.email}'s status to ${newStatus}?`)) {
      setIsSubmittingStatus(true);
      const updatedUser = await updateUserStatusAsAdmin(userToUpdate.id, newStatus);
      if (updatedUser) {
        setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
        addAlert(`User ${updatedUser.name || updatedUser.email} status updated to ${newStatus}.`, 'success');
      } else {
        addAlert('Failed to update user status.', 'error');
      }
      setIsSubmittingStatus(false);
    }
  };
  
  if (loading && users.length === 0) {
    return <div className="p-4 text-center text-gray-500 dark:text-gray-400">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white flex items-center">
          <UsersIconLucide size={28} className="mr-3 text-purple-500" /> Manage Users
        </h2>
      </div>
      
      <Input
        id="search-users-admin"
        type="text"
        placeholder="Search by name, email, ID, role..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        leftIcon={<Search size={18} className="text-gray-400"/>}
      />

      <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
        <table className="w-full min-w-max text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
            <tr>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Role</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map(user => (
              <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <div className="flex items-center">
                    <img src={user.avatarDataUrl || user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name || user.email}&size=32&background=random`} alt={user.name} className="w-8 h-8 rounded-full mr-3 object-cover"/>
                    {user.name || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    user.role === 'admin' 
                    ? 'bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300' 
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-700/30 dark:text-blue-300'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        user.status === 'active' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300' 
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300'
                    }`}>
                        {user.status || 'active'}
                    </span>
                </td>
                <td className="px-6 py-4">
                  <Button
                    variant={user.status === 'active' ? 'danger_outline' : 'success_outline'}
                    size="sm"
                    onClick={() => handleToggleUserStatus(user)}
                    leftIcon={user.status === 'active' ? <UserX size={16}/> : <UserCheck size={16}/>}
                    disabled={isSubmittingStatus || user.id === adminUser?.id}
                    title={user.id === adminUser?.id ? "Cannot change own status" : (user.status === 'active' ? `Suspend ${user.name}` : `Activate ${user.name}`)}
                  >
                    {user.status === 'active' ? 'Suspend' : 'Activate'}
                  </Button>
                  {/* Future: Edit role button <Button variant="ghost" size="sm" onClick={() => addAlert("Edit user role - Not implemented", "info")} className="ml-2"><ShieldCheck size={16}/></Button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!loading && paginatedUsers.length === 0 && (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          <UsersIconLucide size={48} className="mx-auto mb-4 opacity-50"/>
          No users found{searchTerm ? ' matching your search.' : '.'}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center space-x-2">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="secondary"
            leftIcon={<ChevronLeft size={18} />}
          >
            Previous
          </Button>
          <span className="text-gray-700 dark:text-gray-300 px-2">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="secondary"
            rightIcon={<ChevronRight size={18} />}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ManageUsersSection;