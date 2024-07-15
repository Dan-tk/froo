import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store/store'; // Update with your store setup
import { useUpdateUserByIdMutation } from '../app/api/apiSlice'; // Replace with your actual action
import { FaUserCircle } from "react-icons/fa";
import Sidebar from '../components/Common/SideBar';
import { updateUserSuccess } from '../app/store/slices/authSlice';
import AI from '../components/Common/AI'
import { URL as url } from '../URL';

const ProfilePage: React.FC = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ _id:currentUser?._id, name: currentUser?.name, email: currentUser?.email, password: currentUser?.password}); // Initialize with current user data
  const [error, setError] = useState<string | null>(null);
  const [updateUser] = useUpdateUserByIdMutation()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Update user details
      if (currentUser) {
        const response:any = await updateUser({ id: currentUser._id, updatedUser: formData });
        const { updatedUserAccount } = response.data;

        if (updatedUserAccount) {
          dispatch(updateUserSuccess(updatedUserAccount));
          localStorage.setItem('user', JSON.stringify(updatedUserAccount));
          console.log('User details updated successfully');
        }
      }
    } catch (err: any) {
      console.error('Failed to update details:', err);
      setError(err.message || 'Failed to update details. Please try again.');
    }
  };
 
  return (
    <div className="flex h-screen">
      <Sidebar /> 
    <div className="p-3 max-w-lg mx-auto">        
        <h1 className="text-3xl text-left font-semibold my-7">Edit Profile</h1>
        <div className="flex justify-center mb-4">
          {/* <FaUserCircle size={100} /> */}
          {currentUser?.avatar ? (
           <img
            src={`${url}/uploads/${currentUser.avatar}`} 
           /*  src={`http://localhost:8000/uploads/${currentUser.avatar}`} */
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover"
            style={{ width: '100px', height: '100px' }}
           />
          ) : (
            <FaUserCircle size={32} />
          )}
        </div>
        <div className="flex items-center p-3 mb-4">
      
    </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-1">
              Change Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="bg-slate-100 p-3 rounded-lg mb-9"
              required
            />
            <label htmlFor="email" className="mb-1">
              Change Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-slate-100 p-3 rounded-lg mb-9"
              required
            />
            <label htmlFor="password" className="mb-1">
              Change Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder='leave empty to retain your password'
              className="bg-slate-100 p-3 rounded-lg mb-9"
            />
          </div>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <button type="submit" className="bg-blue-500 text-white p-3 rounded-lg mt-4 w-80 mx-auto">
            Save Changes
          </button>
        </form>
        <AI/>
      </div>
    </div>
  );
};

export default ProfilePage;
