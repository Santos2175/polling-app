import axiosInstace from '../api/axiosInstance';
import { API_PATHS } from '../api/config';

// Function to upload image and get the image Url
const uploadImage = async (imageFile) => {
  const formData = new FormData();

  // Append image to formdata
  formData.append('image', imageFile);

  try {
    const response = await axiosInstace.post(
      API_PATHS.IMAGE.UPLOAD_PROFILE_IMAGE,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return response.data;
  } catch (error) {
    console.error('Error uploading profile image', error);
    throw error;
  }
};

export default uploadImage;
