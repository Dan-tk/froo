import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
//@ts-ignore
import * as typeRef from "../../../node_modules/@reduxjs/toolkit/dist/query/react/buildHooks"
import { URL} from '../../URL';

export type Task = {
  _id: string;
  title: string;
  description: string;  
  label: string;
  completed: boolean;
  dueDate: Date;
  userId: User['_id']
};

export type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  tasks: Task[]
};


/* exportt interface RefreshResponse {
  accessToken: string;
}
 */
export interface Headers{
  [key: string]: string;
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
       /* baseUrl: 'http://localhost:8000',  */
       baseUrl: URL, 
      credentials: 'include'
      /* prepareHeaders: (headers, { getState }) => {
        const state = getState() as RootState;
        const token = state.auth.token;

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    } */
     }), // Adjust the base URL as needed
  tagTypes: ['Task'],
  endpoints: (builder) => ({
    // Fetch all Tasks
    getTasks: builder.query<Task[], void>({
      query: () => '/tasks',
      providesTags: ['Task'],
    }),
     // Fetch a single Task by ID
    getTaskById: builder.query<Task, string>({
      query: (id) => `/tasks/task/${id}`,
      providesTags: ['Task'],
    }),
    // Fetch User Tasks
    fetchUserTasks: builder.query<Task[], string>({
      query: (userId) => `user/tasks/${userId}`,
      providesTags: ['Task'], // Adjust the endpoint URL as per your backend
    }),
    // Create a new Task
    createTask: builder.mutation<Task, Partial<Task>>({
      query: (newTask) => ({
        url: '/tasks',
        method: 'POST',
        body: newTask,
      }),
      invalidatesTags: ['Task'],
    }),
    // Update an existing Task
    updateTask: builder.mutation<Task, { id: string; task: Partial<Task> }>({
      query: ({ id, task }) => ({
        url: `/tasks/task/${id}`,
        method: 'PUT',
        body: task,
      }),
      invalidatesTags: ['Task'],
    }),
    // Delete a Task
    deleteTask: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/tasks/task/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task'],
    }),




    // authentication endpoints
    registerUser: builder.mutation<User, Partial<User>>({
      query: (newUser) => ({
        url: '/auth/register',
        method: 'POST',
        body: newUser,
      }),
    }),
    
    loginUser: builder.mutation<User , Partial<User>>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    refreshToken: builder.query<User, void>({
      query: () => '/auth/refresh',
    }),
    logoutUser: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST', // Usually logout endpoints use POST for actions that modify server state
      }),
    }),
    



    //user endpoints
    getUserById: builder.query<User, string>({
      query: (id) => `/user/${id}`,
    }),
    // getAllUsers: builder.query<User[], void>({
    //  query: () => '/users',
      // Assuming the response shape includes `users` as an array of User objects
     // transformResponse: (response: { users: User[] }) => response.users,
    //}), 
    updateUserById: builder.mutation<User, { id: string; updatedUser: Partial<User> }>({
      query: ({ id, updatedUser }) => ({
        url: `/user/${id}`,
        method: 'PUT',
        body: updatedUser,
      }),
    }),
    deleteUserById: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/user/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,  
  useDeleteTaskMutation,
  useRegisterUserMutation,
  useLoginUserMutation,
  useUpdateUserByIdMutation, 
  useDeleteUserByIdMutation,
  useGetUserByIdQuery,
  useRefreshTokenQuery,
  useFetchUserTasksQuery,
  useUpdateTaskMutation,
  useLogoutUserMutation

} = apiSlice;
 

