// export const BASE_URL = 'http://localhost:8000';
export const BASE_URL = import.meta.env.VITE_BASE_URL;

export const API_PATHS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    GET_USER_INFO: '/api/v1/auth/get-user',
  },
  POLLS: {
    CREATE: '/api/v1/polls/create',
    GET_ALL: '/api/v1/polls/get-all-polls',
    VOTED_POLLS: '/api/v1/polls/voted-polls',
    GET_BY_ID: (pollID) => `/api/v1/polls/${pollID}`,
    VOTE: (pollID) => `/api/v1/polls/${pollID}/vote`,
    CLOSE: (pollID) => `/api/v1/polls/${pollID}/close`,
    BOOKMARK: (pollID) => `/api/v1/polls/${pollID}/bookmark`,
    BOOKMARKED: `/api/v1/polls/user/bookmarked`,
    DELETE: (pollID) => `/api/v1/polls/${pollID}/delete`,
  },
  IMAGE: {
    UPLOAD_PROFILE_IMAGE: '/api/v1/auth/upload-profile-image',
  },
};
