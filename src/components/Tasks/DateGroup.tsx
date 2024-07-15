import React, { useEffect, useState } from 'react';
import { useFetchUserTasksQuery } from '../../app/api/apiSlice';
import TaskItem from './Task';
import { Task } from '../../app/api/apiSlice';
import { fetchTasksSuccess } from '../../app/store/slices/taskSlice';
import { RootState } from '../../app/store/store';
import { useDispatch, useSelector } from 'react-redux';

// Import your CSS file
import './task.css'; // Adjust the path as per your project structure

const AllTasks: React.FC = () => {

  /*  const user = {
    "_id": "668fc7a8241da77ed01d72d5",
    "name": "John Doe",
    "email": "john.doe@example.com"
  };  */
  /* const user = {
    "_id": "66902a533a29c357d9c127de",
    "name": "yap",
    "email": "yap@example.com"
  };
 */
  /* const currentUser = user; */
  const currentUser: any  = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  // @ts-ignore
  const { data: userTasks } = useFetchUserTasksQuery(currentUser?._id);
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  // State to hold grouped tasks
  const [groupedTasks, setGroupedTasks] = useState<{ [key: string]: Task[] }>({});

  // State for managing dropdown toggle
  const [isDropdownOpen, setIsDropdownOpen] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // @ts-ignore
    if (userTasks?.userTasks) {
      // @ts-ignore
      dispatch(fetchTasksSuccess(userTasks.userTasks));
    }
  }, [userTasks, dispatch ]);

  // Effect to update grouped tasks when tasks or userTasks change
  useEffect(() => {
    if (tasks.length > 0) {
      const sortedTasks = sortTasksByDateDescending(tasks);
      const grouped = groupTasksByDate(sortedTasks);
      setGroupedTasks(grouped);
    }
  }, [tasks, userTasks]);

  // Function to group tasks by dueDate
  const groupTasksByDate = (tasks: Task[]) => {
    const groupedTasks: { [key: string]: Task[] } = {};

    tasks.forEach(task => {
      const dueDate = new Date(task.dueDate).toLocaleString();
      if (!groupedTasks[dueDate]) {
        groupedTasks[dueDate] = [];
        // Initialize dropdown state for each group
        isDropdownOpen[dueDate] = false;
      }
      groupedTasks[dueDate].push(task);
    });

    // Sort keys (dates) in ascending order (oldest to most recent)
    const sortedKeys = Object.keys(groupedTasks).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA.getTime() - dateB.getTime();
    });

    // Construct grouped tasks object with sorted keys
    const sortedGroupedTasks: { [key: string]: Task[] } = {};
    sortedKeys.forEach(key => {
      sortedGroupedTasks[key] = groupedTasks[key];
    });

    return sortedGroupedTasks;
  };

  // Function to sort tasks by dueDate in descending order
  const sortTasksByDateDescending = (tasks: Task[]) => {
    return tasks.slice().sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      return dateB.getTime() - dateA.getTime();
    });
  };

  // Toggle dropdown visibility
  const toggleDropdown = (dueDate: string) => {
    setIsDropdownOpen(prevState => ({
      ...prevState,
      [dueDate]: !prevState[dueDate]
    }));
  };

  return (
    <div>
      
      {Object.keys(groupedTasks).length > 0 ? (
        Object.keys(groupedTasks).map((dueDate, index) => (
          <div key={index} className="mb-4">
            <button
              className="bg-gray-200 hover:bg-gray-300 py-2 px-4 w-full rounded-md text-left"
              onClick={() => toggleDropdown(dueDate)}
            >
              Tasks Due: {dueDate}
            </button>
            <div className={`mt-2 ${isDropdownOpen[dueDate] ? 'block' : 'hidden'}`}>
              {groupedTasks[dueDate].length > 0 && (
                <div className="relative">
                  {groupedTasks[dueDate].map(task => (
                    <TaskItem key={task._id} task={task} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div>No tasks found.</div>
      )}
    </div>
  );
};

export default AllTasks;
