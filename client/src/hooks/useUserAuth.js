import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstace from '../api/axiosInstance';
import { API_PATHS } from '../api/config';
import { useUser } from './useUser';

export const useUserAuth = () => {
  const { user, updateUser, clearUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) return;

    let isMounted = true;

    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstace.get(API_PATHS.AUTH.GET_USER_INFO);

        if (isMounted && response.data) {
          updateUser(response.data.userInfo);
        }
      } catch (error) {
        console.error(`Failed to fetch user info.`, error);
        if (isMounted) {
          clearUser();
          navigate('/login');
        }
      }
    };

    fetchUserInfo();

    return () => {
      isMounted = false;
    };
  }, [updateUser, clearUser, user]);
};
