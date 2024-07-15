// src/app/slices/taskSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Task {
    _id: string;
    title: string;
    completed: boolean;
    description: string;
    label: string;
    dueDate: Date;
    userId: string; 
}

export interface TaskState {
    tasks: Task[];
    loading: boolean;
    
}

const initialState: TaskState = {
    tasks: [],
    loading: false,
};

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
      // Reducer to set loading state
      setLoading: (state, action: PayloadAction<boolean>) => {
        state.loading = action.payload;
      },
      // Reducer to handle successful fetching of tasks
      fetchTasksSuccess: (state, action: PayloadAction<Task[]>) => {
        state.tasks = action.payload;
        state.loading = false;
      },
      // Reducer to handle task creation
      createTaskSuccess: (state, action: PayloadAction<Task>) => {
        state.tasks.push(action.payload);
        state.loading = false;
      },
      // Reducer to handle task update
      updateTaskSuccess: (state, action: PayloadAction<Task>) => {
        const updatedTask = action.payload;
        const existingTaskIndex = state.tasks.findIndex(task => task._id === updatedTask._id);
        if (existingTaskIndex !== -1) {
          state.tasks[existingTaskIndex] = updatedTask;
        }
        state.loading = false;
      },
      // Reducer to handle task deletion
      deleteTaskSuccess: (state, action: PayloadAction<string>) => {
        state.tasks = state.tasks.filter(task => task._id !== action.payload);
        state.loading = false;
      },
      clearTasks: (state) => {
        state.tasks = [];
        state.loading = false;
    },
    },
  });
  export const {
    setLoading,
    fetchTasksSuccess,
    createTaskSuccess,
    updateTaskSuccess,
    deleteTaskSuccess,
    clearTasks,
  } = taskSlice.actions;

export default taskSlice.reducer;
