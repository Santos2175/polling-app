import React from 'react';
import { HiMiniPlus, HiOutlineTrash } from 'react-icons/hi2';

const OptionImageSelector = ({ imageList, setImageList }) => {
  // Function to handle adding image
  const handleAddImage = (event) => {
    const file = event.target.files[0];

    if (file && imageList.length < 4) {
      const reader = new FileReader();

      // Add object with base64 and file to the array
      reader.onload = () => {
        setImageList([...imageList, { base64: reader.result, file }]);
      };

      reader.readAsDataURL(file);
      event.target.value = null;
    }
  };

  // Function to handle deleting image
  const handleDeleteImage = (index) => {
    const updateArr = imageList.filter((_, idx) => idx !== index);
    setImageList(updateArr);
  };

  return (
    <div>
      {imageList?.length > 0 && (
        <div className='grid grid-cols-2 gap-2 mb-4'>
          {imageList.map((item, index) => (
            <div key={index} className='bg-gray-600/10 rounded-md relative'>
              <img
                src={item.base64}
                alt={`option_${index}`}
                className='w-full h-36 object-contain rounded-md'
              />

              <button
                onClick={() => handleDeleteImage(index)}
                className='text-red-500 bg-gray-100 rounded-full p-2 absolute top-2 right-2 cursor-pointer'>
                <HiOutlineTrash className='text-lg ' />
              </button>
            </div>
          ))}
        </div>
      )}

      {imageList.length < 4 && (
        <div className='flex items-center gap-5'>
          <input
            type='file'
            accept='image/jpeg,image/png'
            onChange={handleAddImage}
            className='hidden'
            id='imageInput'
          />

          <label htmlFor='imageInput' className='btn-small text-nowrap'>
            <HiMiniPlus className='text-lg' />
            Select Image
          </label>
        </div>
      )}
    </div>
  );
};

export default OptionImageSelector;
