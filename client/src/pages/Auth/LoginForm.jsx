import { useState } from 'react';
import AuthLayout from '../../components/layout/AuthLayout';
import { Link, useNavigate } from 'react-router-dom';
import AuthInput from '../../components/ui/AuthInput';
import { isValidEmail } from '../../utils/helper';
import axiosInstace from '../../api/axiosInstance';
import { API_PATHS } from '../../api/config';
import { useUser } from '../../hooks/useUser';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);

  const { updateUser } = useUser();

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Submitting data', formData);

    // Validation checks
    if (!isValidEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!formData.password) {
      setError('Please enter the password');
      return;
    }

    setError('');

    // Login API call
    try {
      const response = await axiosInstace.post(API_PATHS.AUTH.LOGIN, {
        ...formData,
      });
      console.log(response);

      const { token, user } = response.data?.data;

      if (token) {
        localStorage.setItem('token', token);
        updateUser(user);
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError(`Something went wrong. Please try again`);
      }
    }
  };

  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Welcome back</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Please enter your details to log in
        </p>

        <form onSubmit={handleLogin}>
          <AuthInput
            value={formData.email}
            onChange={({ target }) =>
              setFormData((prev) => ({ ...prev, email: target.value }))
            }
            label='Email Address'
            placeholder='Johndoe@gmail.com'
            type='text'
          />

          <AuthInput
            value={formData.password}
            onChange={({ target }) =>
              setFormData((prev) => ({ ...prev, password: target.value }))
            }
            label='Password'
            placeholder='Minimun 8 characters'
            type='password'
          />

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button type='submit' className='btn-primary'>
            LOGIN
          </button>

          <p className='text-[13px] text-slate-800 mt-3'>
            Don't have an account?{' '}
            <Link to='/sign-up' className='font-medium text-primary underline'>
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default LoginForm;
