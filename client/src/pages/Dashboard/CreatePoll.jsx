import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useUser } from '../../hooks/useUser';
import { useUserAuth } from '../../hooks/useUserAuth';
import { POLL_TYPE } from '../../utils/data';
import OptionInput from '../../components/ui/OptionInput';
import OptionImageSelector from '../../components/ui/OptionImageSelector';

const CreatePoll = () => {
  useUserAuth();

  const { user } = useUser();

  const [pollData, setPollData] = useState({
    question: '',
    type: '',
    options: [],
    imageOptions: [],

    error: '',
  });

  const handleValueChange = (key, value) => {
    setPollData((prev) => ({ ...prev, [key]: value }));
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
      </div>
    </DashboardLayout>
  );
};

export default CreatePoll;
