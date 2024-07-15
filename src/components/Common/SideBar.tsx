// Sidebar.tsx
import React from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import { FaHome, FaBell, FaSignOutAlt, FaTags, FaPlus, FaSearch } from 'react-icons/fa';
import { AiOutlineAppstore } from "react-icons/ai";
import Profile from '../Profile/Profile';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store/store';
import { logoutAndClearTasks} from '../../app/store/slices/authSlice';


const Sidebar: React.FC = () => {
  const taskCount = useSelector((state: RootState) => state.taskCount.count);
  const dispatch:any = useDispatch();
  const navigate = useNavigate()

  const handleLogout = ()=>{
    /* dispatch(logoutSuccess()); */
    dispatch(logoutAndClearTasks());
    navigate('/signin')
  }
  return (
    <div className="bg-[#E2EDF8] h-screen p-5 w-64 flex flex-col justify-between">
      <div>
        <Profile />
        <div className="relative mt-5 mb-5">
        <FaSearch className="absolute top-3 left-3" /> 
           <input
             type="text"
             placeholder="Search"
             className="w-full bg-white p-2 pl-10 rounded-md" 
           />
        </div>
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-center py-2 px-4 rounded-md text-gray-800 hover:bg-gray-200">
            <FaHome className="mr-3" />
            Home
          </Link>
          <Link to="/all" className="flex items-center py-2 px-4 rounded-md text-gray-800 hover:bg-gray-200">
            <AiOutlineAppstore className="mr-3" />
            All
          </Link>
          <Link to="/labels" className="flex items-center py-2 px-4 rounded-md text-gray-800 hover:bg-gray-200">
            <FaTags className="mr-3" />
            Labels
          </Link>
          <Link to="/create" className="flex items-center py-2 px-4 rounded-md text-gray-800 hover:bg-gray-200">
            <FaPlus className="mr-3" />
            Create
          </Link>
          <Link to="/notifications" className="flex items-center py-2 px-4 rounded-md text-gray-800 hover:bg-gray-200 relative">            
              <FaBell className="mr-3" />
              {/* Badge for task count */}
              {taskCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs">{taskCount}</span>
              )}
              Notifications
          </Link>
        </div>
      </div>
      <div className='flex items-center py-2 px-4 rounded-md text-gray-800 hover:bg-gray-200'>
       <p><Link to="https://feedback-aeac4c.zapier.app/submit-form">Feedback</Link></p>
     </div>
      <button
      className="flex items-center py-2 px-4 rounded-md text-gray-800 hover:bg-gray-200"
      onClick={handleLogout}
      >
      <FaSignOutAlt className="mr-3" />
      Logout
    </button>
    </div>
  );
};

export default Sidebar;
