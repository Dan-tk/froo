import { User } from '../../api/apiSlice';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { clearTasks } from './taskSlice';
// Function to retrieve user from localStorage
const getUserFromLocalStorage = (): User | null => {
  const userJson = localStorage.getItem('user');
  if (userJson) {
    try {
      return JSON.parse(userJson);
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      return null;
    }
  }
  return null;
};
const getAuth =():boolean  =>{
  const isAuth = localStorage.getItem('isAuthenticated')
  if(isAuth){
    return true
  }
  return false
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: AuthState = {
  isAuthenticated: getAuth(),
  user: getUserFromLocalStorage(), // Initialize user state from localStorage
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<User>) {
      state.isAuthenticated = true;
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload)); // Save user to localStorage
      localStorage.setItem('isAuthenticated', 'true');
    },
    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('user'); // Remove user from localStorage
      localStorage.removeItem('chatHistory');
      localStorage.removeItem('isAuthenticated');
    },
    updateUserSuccess(state, action: PayloadAction<User>) {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload)); // Update user in localStorage
    },
    deleteUserSuccess(state) {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('user'); // Remove user from localStorage
    },
    initializeAuth(state){
      state.isAuthenticated = true
    }
  },
});

export const { loginSuccess,initializeAuth, logoutSuccess, updateUserSuccess, deleteUserSuccess } = authSlice.actions;

export default authSlice.reducer;

export const logoutAndClearTasks = () => (dispatch: any) => {
  dispatch(logoutSuccess());
  dispatch(clearTasks()); // Dispatch clearTasks from taskSlice
};

// Function to check authentication status from localStorage
export const checkAuthenticationStatus = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated;
};