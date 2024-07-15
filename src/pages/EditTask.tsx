// src/pages/EditTask.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetTaskByIdQuery, useUpdateTaskMutation } from '../app/api/apiSlice';
import Sidebar from '../components/Common/SideBar';
import { updateTaskSuccess } from '../app/store/slices/taskSlice';
//@ts-ignore
import { useSelector,  useDispatch } from 'react-redux';
import AI from '../components/Common/AI'
/* import { updateTask } from '../app/store/slices/taskSlice'; */

const EditTask: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { data: task, isLoading: isLoadingTask } = useGetTaskByIdQuery(taskId!);
  const [updateTaskMutation, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

 
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [label, setLabel] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setLabel(task.label);
      setCompleted(task.completed),
      setDueDate(new Date(task.dueDate).toISOString().split('T')[0]);
    }
    /* console.log(task) */
  }, [task]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (task) {
     /*  console.log("yaya"); */
      
      try { 
        const updatedTask = {
          title,
          description,
          label,
          completed,
           dueDate: new Date(dueDate), 
          /* dueDate: "2024-08-05T18:59:00.000Z", */
          userId: task.userId
          /* userId: task.userId, */
        };
        /* console.log("oioioi", task._id, updatedTask) */
        const result = await updateTaskMutation({ id: task._id, task: updatedTask }).unwrap();
        /* console.log('Updated task:', result); */

       /*  // Dispatch action to update tasks state in Redux
        dispatch(updateTask(result)); */
        dispatch(updateTaskSuccess(result));
        
        navigate('/');
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  };

  if (isLoadingTask) return <div>Loading...</div>;

  return (
    <div className='flex h-screen'>
      <Sidebar />
      <div className='flex-1 p-4'>
        <div>Edit Task</div>
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
              isUpdating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Update Task'}
          </button>
        </form>
        <AI/>
      </div>
    </div>
  );
};

export default EditTask;
