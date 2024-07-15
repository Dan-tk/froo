import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterUserMutation } from '../../app/api/apiSlice';
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import { URL as url } from '../../URL';

type FormData = {
  name: string;
  email: string;
  password: string;
  avatar?: string;
};

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false); // State to track checkbox
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  //@ts-ignore
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const [registerUser] = useRegisterUserMutation();
 
  //handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     setFormData({ ...formData, [e.target.id]: e.target.value }); 
    
  };
 //handle avatar change
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));

      uploadImage(file)
      .then((response) => {
        const imageUrl = response.file; // Ensure this is how backend sends the image URL
        console.log('Image uploaded successfully');

        setFormData({ ...formData, avatar: imageUrl }); // Update formData with the image URL
      })
      .catch((error) => {
        console.error('Failed to upload image:', error);
        // Handle error state or retry logic if needed
      });

    }
  };

  //handle avatar click
  const handleAvatarClick = () => {
    const fileInput = document.getElementById('avatar') as HTMLInputElement;
    fileInput.click();
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAccepted(e.target.checked);
  };

  const uploadImage = async (imageFile: File) => {
    const imageData = new FormData();
    imageData.append('avatar', imageFile);

    try {
       const response = await axios.post(`${url}/uploads/upload-avatar`, imageData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }, 
       /*  const response = await axios.post('http://localhost:8000/uploads/upload-avatar', imageData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }, */
        
        
      });
      console.log("imageUploaded");
      return response.data; // Assuming the server returns the image URL in the response
    } catch (err) {
      console.error('Failed to upload image', err);
      throw err;
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    

    try {
      // Perform registration logic
      await registerUser(formData);
      console.log('Registration successful');
      navigate('/signin');
    } catch (err) {
      setError('Failed to register. Please try again.');
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-left font-semibold my-7'>Sign Up</h1>
      <div className='flex gap-2 mt-5 justify-center'>
        <p>Have an account?</p>
        <Link to='/signin'>
          <span className='text-blue-500'>Sign in now</span>
        </Link>
      </div>
      <form onSubmit={handleRegister} className='flex flex-col gap-4'>
        <div className='flex flex-col'>
        {avatarPreview ? (
            <img
              src={avatarPreview}
              alt='Avatar Preview'
              className='w-24 h-24 rounded-full mb-4 object-cover'
              onClick={handleAvatarClick}
              style={{ cursor: 'pointer' }}
            />
          ) : (
            <FaUserCircle
              className='w-24 h-24 text-gray-400 mb-4'
              onClick={handleAvatarClick}
              style={{ cursor: 'pointer' }}
            />
          )}
          <input
            type='file'
            id='avatar'
            className='hidden'
            onChange={handleAvatarChange}
            accept='image/*'
          />
          <label htmlFor='name' className='mb-1'>Name</label>
          <input
            type='text'
            placeholder='Name'
            id='name'
            className='bg-slate-100 p-3 rounded-lg'
            onChange={handleChange}
            value={formData.name}
            required
          />
        </div>
        <div className='flex flex-col'>
          <label htmlFor='email' className='mb-1'>Email</label>
          <input
            type='email'
            placeholder='Email'
            id='email'
            className='bg-slate-100 p-3 rounded-lg'
            onChange={handleChange}
            value={formData.email}
            required
          />
        </div>
        <div className='flex flex-col'>
          <label htmlFor='password' className='mb-1'>Password</label>
          <input
            type='password'
            placeholder='Password'
            id='password'
            className='bg-slate-100 p-3 rounded-lg'
            onChange={handleChange}
            value={formData.password}
            required
          />
        </div>        
        <div className='px-5 flex items-center mt-4'>
          <input
            type='checkbox'
            id='terms'
            className='mr-2'
            onChange={handleCheckboxChange}
            required
          />
          <label htmlFor='terms'>I accept the terms and conditions</label>
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button
          type='submit'
          className={`bg-blue-500 text-white p-3 rounded-lg mt-9 w-80 mx-auto ${(!termsAccepted || !formData.name || !formData.email || !formData.password) ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!termsAccepted || !formData.name || !formData.email || !formData.password}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Register;
