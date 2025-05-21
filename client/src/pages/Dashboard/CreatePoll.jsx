import { useState } from 'react';
import { toast } from 'react-hot-toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useUser } from '../../hooks/useUser';
import { useUserAuth } from '../../hooks/useUserAuth';
import { POLL_TYPE } from '../../utils/data';
import OptionInput from '../../components/ui/OptionInput';
import OptionImageSelector from '../../components/ui/OptionImageSelector';
import uploadImage from '../../utils/uploadImage';
import axiosInstace from '../../api/axiosInstance';
import { API_PATHS } from '../../api/config';

const CreatePoll = () => {
  useUserAuth();

  const { user, onPollCreateOrDelete } = useUser();

  const [pollData, setPollData] = useState({
    question: '',
    type: '',
    options: [],
    imageOptions: [],

    error: '',
  });

  // Update images and get image URLs
  const updateImageAndGetLink = async (imageOptions) => {
    const optionPromises = imageOptions.map(async (imageOption) => {
      try {
        const imgUploadRes = await uploadImage(imageOption.file);
        return imgUploadRes.imageUrl || '';
      } catch (error) {
        toast.error(`Error uploading image: ${imageOption.file.name}`);
        return '';
      }
    });

    const optionArr = await Promise.all(optionPromises);
    return optionArr;
  };

  const getOptionsData = async () => {
    switch (pollData.type) {
      case 'single-choice':
        return pollData.options;

      case 'image-based':
        const options = await updateImageAndGetLink(pollData.imageOptions);
        return options;

      default:
        return [];
    }
  };

  const handleValueChange = (key, value) => {
    setPollData((prev) => ({ ...prev, [key]: value }));
  };

  // Clear data
  const clearData = () => {
    setPollData({
      question: '',
      type: '',
      options: [],
      imageOptions: [],

      error: '',
    });
  };

  // Handle poll creation
  const handleCreatePoll = async () => {
    const { question, options, type, imageOptions, error } = pollData;

    if (!question || !type) {
      handleValueChange('error', 'Question and Type are required.');
      return;
    }

    if (type === 'single-choice' && options.length < 2) {
      handleValueChange('error', 'Enter at least 2 options.');
      return;
    }

    if (type === 'image-based' && imageOptions.length < 2) {
      handleValueChange('error', 'Enter at least 2 options.');
      return;
    }

    handleValueChange('error', '');

    const optionsData = await getOptionsData();

    // API call
    try {
      const response = await axiosInstace.post(API_PATHS.POLLS.CREATE, {
        question,
        type,
        options: optionsData,
      });

      if (response.data) {
        toast.success('Poll created successfully');
        onPollCreateOrDelete();
        clearData();
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
        handleValueChange('error', error.response.data.message);
      } else {
        handleValueChange('error', 'Something went wrong. Please try again.');
      }
    }
  };

  return (
    <DashboardLayout activeMenu='Create Poll'>
      <div className='bg-gray-100/80 p-5 my-5 rounded-lg mx-auto'>
        <h2 className='text-lg font-medium text-black'>Create Poll</h2>

        {/* QUESTION INPUT */}
        <div className='mt-3'>
          <label className='text-xs font-medium text-slate-600'>
            QUESTIONS
          </label>

          <textarea
            placeholder="What's on your mind?"
            rows='4'
            className='w-full text-[13px] outline-none bg-slate-200/80 p-2 rounded-md mt-2'
            value={pollData.question}
            onChange={({ target }) =>
              handleValueChange('question', target.value)
            }
          />
        </div>

        {/* SELECT POLL TYPE */}
        <div className='mt-3'>
          <label className='text-xs font-medium text-slate-600'>
            POLL TYPE
          </label>

          <div className='flex gap-4 flex-wrap mt-3'>
            {POLL_TYPE.map((item) => (
              <div
                key={item.value}
                className={`option-chip ${
                  pollData.type === item.value
                    ? 'text-white bg-primary border-primary'
                    : 'border-sky-100 hover:border-primary'
                }`}
                onClick={() => handleValueChange('type', item.value)}>
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {pollData.type === 'single-choice' && (
          <div className='mt-5'>
            <label
              className='text-xs font-medium text-slate-600
            '>
              OPTIONS
            </label>

            <div className='mt-3'>
              <OptionInput
                optionList={pollData.options}
                setOptionList={(value) => handleValueChange('options', value)}
              />
            </div>
          </div>
        )}

        {pollData.type === 'image-based' && (
          <div className='mt-5'>
            <label className='text-xs font-medium text-slate-600'>
              IMAGE OPTIONS
            </label>

            <div className='mt-3'>
              <OptionImageSelector
                imageList={pollData.imageOptions}
                setImageList={(value) =>
                  handleValueChange('imageOptions', value)
                }
              />
            </div>
          </div>
        )}

        {pollData.error && (
          <p className='text-xs font-medium text-red-500 mt-5'>
            {pollData.error}
          </p>
        )}

        <button className='btn-primary py-2 mt-6' onClick={handleCreatePoll}>
          CREATE
        </button>
      </div>
    </DashboardLayout>
  );
};

export default CreatePoll;
