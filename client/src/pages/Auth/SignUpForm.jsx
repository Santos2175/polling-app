import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import ProfilePhotoSelector from '../../components/ui/ProfilePhotoSelector';
import AuthInput from '../../components/ui/AuthInput';
import { isValidEmail } from '../../utils/helper';
import axiosInstace from '../../api/axiosInstance';
import { API_PATHS } from '../../api/config';
import { useUser } from '../../hooks/useUser';
import uploadImage from '../../utils/uploadImage';

const SignUpForm = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [formData, setFormData] = useState({
    profileImageUrl: null,
    fullName: '',
    email: '',
    username: '',
    password: '',
  });
  const { updateUser } = useUser();
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = '';

    // Validate inputs
    if (!formData.fullName) {
      setError('Please enter your full name');
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError('Please enter a valid email');
      return;
    }

    if (!formData.username) {
      setError('Please enter username');
      return;
    }

    if (!formData.password) {
      setError('Please enter the password');
      return;
    }

    setError('');

    // SignUp API call
    try {
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes?.imageUrl || '';
      }

      const response = await axiosInstace.post(API_PATHS.AUTH.REGISTER, {
        ...formData,
        profileImageUrl,
      });

      const { token, user } = response.data.data;

      if (token) {
        localStorage.setItem('token', token);
        updateUser(user);
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError(`Something went wrong. Please try again.`);
      }
    }
  };

  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Create an account</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Join us today by entering your details
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <AuthInput
              value={formData.fullName}
              onChange={({ target }) =>
                setFormData((prev) => ({ ...prev, fullName: target.value }))
              }
              label='Full Name'
              placeholder='John Doe'
              type='text'
            />

            <AuthInput
              value={formData.email}
              onChange={({ target }) =>
                setFormData((prev) => ({ ...prev, email: target.value }))
              }
              label='Email Address'
              placeholder='johndoe@gmail.com'
              type='text'
            />

            <AuthInput
              value={formData.username}
              onChange={({ target }) =>
                setFormData((prev) => ({ ...prev, username: target.value }))
              }
              label='Username'
              placeholder='@'
              type='text'
            />

            <AuthInput
              value={formData.password}
              onChange={({ target }) =>
                setFormData((prev) => ({ ...prev, password: target.value }))
              }
              label='Password'
              placeholder='Min 8 characters'
              type='password'
            />
          </div>

          {error && <p className='text-xs text-red-500 pb2.5'>{error}</p>}

          <button type='submit' className='btn-primary'>
            CREATE ACCOUNT
          </button>

          <p className='text-[13px] text-slate-800 mt-3'>
            Already have an account?{' '}
            <Link to='/login' className='font-medium text-primary underline'>
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUpForm;
