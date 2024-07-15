import React from 'react'
import { useSelector} from 'react-redux'
import { RootState } from '../../app/store/store'
import { Link } from 'react-router-dom'
import { FaUserCircle } from "react-icons/fa";
import { URL as url } from '../../URL';

const Profile: React.FC= () => {
    //const currentUser = useSelector((state: RootState) => state.user.currentUser);
  /*    const currentUser = useSelector((state: RootState) => state.auth.user) */
  const currentUser = useSelector((state: RootState) => state.auth.user);
  /* console.log(currentUser); */
  

  return (
    <div className="flex items-center p-3 mb-4">
      <Link to="/profile" className="flex items-center space-x-2">
        {currentUser?.avatar ? (
          <img
            src={`${url}/uploads/${currentUser.avatar}`} 
            /* src={`http://localhost:8000/uploads/${currentUser.avatar}`} */
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <FaUserCircle size={32} />
        )}
        {currentUser ? (
          <p className="ml-2">{currentUser.name}</p>
        ) : (
          <p className="ml-2">Guest</p>
        )}
      </Link>
    </div>
  );
};


export default Profile