import ImageOptionInputTile from '../ui/ImageOptionInputTile';
import OptionInputTile from '../ui/OptionInputTile';
import Rating from '../ui/Rating';

const PollContent = ({
  type,
  options,
  selectedOptionIndex,
  onOptionSelect,
  rating,
  onRatingChange,
  userResponse,
  onResponseChange,
}) => {
  switch (type) {
    case 'single-choice':
    case 'yes/no':
      return (
        <>
          {options.map((option, index) => (
            <OptionInputTile
              key={option._id}
              isSelected={selectedOptionIndex === index}
              label={option.optionText || ''}
              onSelect={() => onOptionSelect(index)}
            />
          ))}
        </>
      );

    case 'rating':
      return <Rating value={rating} onChange={onRatingChange} />;

    case 'open-ended':
      return (
        <div className='-mt-3'>
          <textarea
            placeholder='Your Response'
            className='w-full text-[13px] text-black outline-none bg-slate-200/80 p-2 rounded-md mt-2'
            rows={4}
            value={userResponse}
            onChange={({ target }) => onResponseChange(target.value)}
          />
        </div>
      );

    case 'image-based':
      return (
        <div className='grid grid-cols-2 gap-4'>
          {options.map((option, index) => (
            <ImageOptionInputTile
              key={option._id}
              isSelected={selectedOptionIndex === index}
              imgUrl={option.optionText || ''}
              onSelect={() => onOptionSelect(index)}
            />
          ))}
        </div>
      );

    default:
      return null;
  }
};

export default PollContent;
