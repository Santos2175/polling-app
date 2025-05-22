import { useState } from 'react';
import { useUser } from '../../hooks/useUser';
import { getPollBookmarked } from '../../utils/helper';
import UserProfileInfo from '../cards/UserProfileInfo';
import PollActions from './PollActions';
import PollContent from './PollContent';

const PollCard = ({
  pollId,
  type,
  question,
  options,
  voters,
  responses,
  creatorProfileImg,
  creatorName,
  creatorUsername,
  userHasVoted,
  isPollClosed,
  isMyPoll,
  createdAt,
}) => {
  const { user } = useUser();

  const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1);
  const [rating, setRating] = useState(0);
  const [userResponse, setUserResponse] = useState('');

  const [isVoteComplete, setIsVoteComplete] = useState(userHasVoted);

  const [pollResult, setPollResult] = useState({
    options,
    voters,
    responses,
  });

  const isPollBookmarked = getPollBookmarked(
    pollId,
    user.bookmarkedPolls || []
  );

  const [pollBookmarked, setIsPollBookmarked] = useState(isPollBookmarked);
  const [pollClosed, setPollClosed] = useState(isPollClosed || false);
  const [pollDeleted, setPollDeleted] = useState(false);

  // Handles user input based on type
  const handleInput = (value) => {
    if (type === 'rating') setRating(value);
    else if (type === 'open-ended') setUserResponse(value);
    else setSelectedOptionIndex(value);
  };

  return (
    !pollDeleted && (
      <div className='bg-slate-100/50 my-5 p-5 rounded-lg border border-slate-100 mx-auto'>
        <div className='flex items-start  justify-between'>
          <UserProfileInfo
            imgUrl={creatorProfileImg}
            fullName={creatorName}
            username={creatorUsername}
            createdAt={createdAt}
          />

          <PollActions
            pollId={pollId}
            isVoteComplete={isVoteComplete}
            inputCaptured={
              !!(userResponse || selectedOptionIndex >= 0 || rating)
            }
            onVoteSubmit={() => {}}
            isBookmarked={pollBookmarked}
            toggleBookmark={() => {}}
            isMyPoll={isMyPoll}
            pollClosed={pollClosed}
            onClosePoll={() => {}}
            onDelete={() => {}}
          />
        </div>

        <div className='ml-4 mt-3'>
          <p className='text-[15px] text-black leading-8'>{question}</p>

          <div className='mt-4'>
            <PollContent
              type={type}
              options={options}
              selectedOptionIndex={selectedOptionIndex}
              onOptionSelect={handleInput}
              rating={rating}
              onRatingChange={handleInput}
              userResponse={userResponse}
              onResponseChange={handleInput}
            />
          </div>
        </div>
      </div>
    )
  );
};

export default PollCard;
