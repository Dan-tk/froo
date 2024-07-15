
import Sidebar from '../components/Common/SideBar';
import React, { useState } from 'react';
import { useCreateTaskMutation } from '../app/api/apiSlice';
import { RootState } from '../app/store/store';
import { useSelector , useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createTaskSuccess } from '../app/store/slices/taskSlice';
import AI from '../components/Common/AI'

/* import { addTask } from '../app/store/slices/taskSlice'; */

const Create: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [label, setLabel] = useState('');
  const [dueDate, setDueDate] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch()
 
  /* const user= {
    "_id": "668fc7a8241da77ed01d72d5",
    "name": "John Doe",
    "email": "john.doe@example.com"
  } */

  /* const user = {
    "_id": "66902a533a29c357d9c127de",
    "name": "yap",
    "email": "yap@example.com"
  }; */
  /* const currentUser = useSelector((state: RootState) => state.user.currentUser); */
  /* const currentUser = user */
  const currentUser: any  = useSelector((state: RootState) => state.auth.user);

  const [createTask, { isLoading }] = useCreateTaskMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (currentUser) {
      const newTask = {
        title,
        completed:false,
        description,
        label,
        dueDate: new Date(dueDate),
        userId: currentUser._id,
      };
      /* console.log('Original due date:', dueDate);
      console.log('Parsed due date:', new Date(dueDate));
 */

      try {
        const result = await createTask(newTask).unwrap();
        /* console.log('Created task:', result);
 */
        /* dispatch(addTask(result)) */
        dispatch(createTaskSuccess(result))

        setTitle('');
        setDescription('');
        setLabel('');
        setDueDate('');

        navigate('/');
      } catch (error) {
        console.error('Error creating task:', error);
      }
    }
  };

  // Function to check if all form fields are filled
  const isFormFilled = title !== '' && description !== '' && label !== '' && dueDate !== '';

  return (
    <div className='flex h-screen'>
      <Sidebar />
      <div className='flex-1 p-4'>
        <div>Create Task</div>
        <form onSubmit={handleSubmit} className='mt-4'>
          <div className='mb-4'>
            <label htmlFor='title' className='block text-sm font-medium text-gray-700'>
              Title
            </label>
            <input
              type='text'
              id='title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='description' className='block text-sm font-medium text-gray-700'>
              Description
            </label>
            <textarea
              id='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              rows={4}
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='label' className='block text-sm font-medium text-gray-700'>
              Label
            </label>
            <input
              type='text'
              id='label'
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className='mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='dueDate' className='block text-sm font-medium text-gray-700'>
              Due Date
            </label>
            <input
              type='datetime-local'
              /* type='datetime-local' */
              id='dueDate'
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className='mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              required
            />
          </div>
          <button
            type='submit'
            className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 ${
              !isFormFilled && 'opacity-50 cursor-not-allowed'
            }`}
            disabled={!isFormFilled || isLoading} // Disable button if form is not filled or if mutation is loading
          >
           {isLoading ? 'Creating...' : 'Create Task'}
          </button>
        </form>
        <AI/>
      </div>
    </div>
  );
};

export default Create;
