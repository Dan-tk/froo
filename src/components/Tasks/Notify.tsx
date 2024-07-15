import React, { useEffect } from 'react';
import { useFetchUserTasksQuery } from '../../app/api/apiSlice';
import TaskItem from './Task';
import { Task } from '../../app/api/apiSlice';
import { RootState } from '../../app/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasksSuccess } from '../../app/store/slices/taskSlice';
import { setTaskCount } from '../../app/store/slices/taskCountSlice';

const Notifications: React.FC = () => {
  /* const user = {
    "_id": "66902a533a29c357d9c127de",
    "name": "yap",
    "email": "yap@example.com"
  }; */

 /*  const currentUser = user; */
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

    

    // Update the task count in Redux store
    const notificationsCount = getTasksDueWithinOneDay(tasks).length;
    dispatch(setTaskCount(notificationsCount));
  }, [userTasks,tasks, dispatch, currentUser]);

  // Function to filter tasks due within one day from now
  const getTasksDueWithinOneDay = (tasks: Task[]): Task[] => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 2);

    return tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return dueDate <= tomorrow && dueDate > today;
    });
  };

  // Filter tasks due within one day
  const notifications = getTasksDueWithinOneDay(tasks);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Notifications - Tasks Due within 1 Day</h1>
      {notifications.length > 0 ? (
        notifications.map(task => (
          <TaskItem key={task._id} task={task} />
        ))
      ) : (
        <div>No tasks due within 1 day.</div>
      )}
    </div>
  );
};

export default Notifications;
