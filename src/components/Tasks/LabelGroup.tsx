import React, { useEffect, useState } from 'react';
import { useFetchUserTasksQuery } from '../../app/api/apiSlice';
import TaskItem from './Task';
import { Task } from '../../app/api/apiSlice';
import { fetchTasksSuccess } from '../../app/store/slices/taskSlice';
import { RootState } from '../../app/store/store';
import { useDispatch, useSelector } from 'react-redux';
import './task.css'; // Import your CSS file

const AllTasks: React.FC = () => {
  /* const user = {
    "_id": "66902a533a29c357d9c127de",
    "name": "yap",
    "email": "yap@example.com"
  };
 */
  /* const currentUser = user; */
  const currentUser: any  = useSelector((state: RootState) => state.auth.user);

  const dispatch = useDispatch();
  const { data: userTasks } = useFetchUserTasksQuery(currentUser?._id);
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  useEffect(() => {
    // @ts-ignore
    if (userTasks?.userTasks) {
      // @ts-ignore
      dispatch(fetchTasksSuccess(userTasks.userTasks));
    }
  }, [userTasks, dispatch,currentUser]);

  // Function to group tasks by label
  const groupTasksByLabel = (tasks: Task[]) => {
    const groupedTasks: { [key: string]: Task[] } = {};

    tasks.forEach(task => {
      const label = task.label || 'No Label'; // Default to 'No Label' if label is not defined
      if (!groupedTasks[label]) {
        groupedTasks[label] = [];
      }
      groupedTasks[label].push(task);
    });

    return groupedTasks;
  };

  // Group tasks by label
  const groupedTasks = groupTasksByLabel(tasks);

  // State to manage dropdown visibility
  const [dropdownOpen, setDropdownOpen] = useState<{ [key: string]: boolean }>({});

  // Function to toggle dropdown visibility
  const toggleDropdown = (label: string) => {
    setDropdownOpen(prevState => ({
      ...prevState,
      [label]: !prevState[label]
    }));
  };

  return (
    <div>      
      {Object.keys(groupedTasks).length > 0 ? (
        Object.keys(groupedTasks).map((label, index) => (
          <div key={index} className="mb-4">
            <button
              className="bg-gray-200 hover:bg-gray-300 py-2 px-4 w-full rounded-md text-left"
              onClick={() => toggleDropdown(label)}
            >
              {label} ({groupedTasks[label].length} tasks)
            </button>
            {dropdownOpen[label] && (
              <div className="mt-2 grid gap-4">
                {groupedTasks[label].map(task => (
                  <TaskItem key={task._id} task={task} />
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <div>No tasks found.</div>
      )}
    </div>
  );
};

export default AllTasks;
