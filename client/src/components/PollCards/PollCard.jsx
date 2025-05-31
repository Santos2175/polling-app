import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useUser } from '../../hooks/useUser';
import { getPollBookmarked } from '../../utils/helper';
import UserProfileInfo from '../cards/UserProfileInfo';
import PollActions from './PollActions';
import PollContent from './PollContent';
import axiosInstance from '../../api/axiosInstance';
import { API_PATHS } from '../../api/config';
import PollingResultContent from './PollingResultContent';

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
  page,
}) => {
  const { user, onUserVoted, toggleBookmarkId, onPollCreateOrDelete } =
    useUser();

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

  // Generates post data based on the type
  const getPostData = useCallback(() => {
    if (type === 'open-ended') {
      return { responseText: userResponse, voterId: user._id };
    }

    if (type === 'rating') {
      return { optionText: rating - 1, voterId: user._id };
    }

    return { optionText: selectedOptionIndex, voterId: user._id };
  }, [type, userResponse, rating, selectedOptionIndex, user]);

  // Get Poll Details by ID
  const getPollDetail = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.POLLS.GET_BY_ID(pollId)
      );

      if (response.data) {
        const pollDetails = response.data.poll;

        setPollResult({
          options: pollDetails.options || [],
          voters: pollDetails.voters.length || 0,
          responses: pollDetails.responses || [],
        });
      }
    } catch (error) {
      console.error(
        error.response?.data?.message || 'Error retrieving poll detail'
      );
    }
  };

  // Handles vote submit
  const handleVoteSubmit = async () => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.POLLS.VOTE(pollId),
        getPostData()
      );

      getPollDetail();
      onUserVoted();
      setIsVoteComplete(true);
      toast.success('Vote submitted successfully');
    } catch (error) {
      console.error(
        error.response?.data?.message ||
          'Error submitting vote. Please try again'
      );
    }
  };

  // Toggle the bookmark status of poll
  const toggleBookmark = async () => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.POLLS.BOOKMARK(pollId)
      );

      toggleBookmarkId(pollId);
      setIsPollBookmarked((prev) => !prev);
      toast.success(response.data?.message);
    } catch (error) {
      console.error(error.response?.data?.message || 'Error bookmarking poll');
    }
  };

  // Close Poll
  const handleClosePoll = async () => {
    try {
      const response = await axiosInstance.post(API_PATHS.POLLS.CLOSE(pollId));

      if (response.data) {
        setPollClosed(true);
        toast.success(response.data?.message || 'Poll Closed Successfully!');
      }
    } catch (error) {
      toast.error(`Something went wrong. Please try again.`);
      console.error('Something went wrong. please try again.', error);
    }
  };

  // Delete Poll
  const handleDeletePoll = async () => {
    try {
      const response = await axiosInstance.delete(
        API_PATHS.POLLS.DELETE(pollId)
      );

      if (response.data) {
        setPollDeleted(true);
        onPollCreateOrDelete('delete');
        toast.success(response.data?.message || 'Poll deleted successfully!');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      console.error('Something went wrong. Please try again.', error);
    }
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
            onVoteSubmit={handleVoteSubmit}
            isBookmarked={pollBookmarked}
            toggleBookmark={toggleBookmark}
            isMyPoll={isMyPoll}
            pollClosed={pollClosed}
            onClosePoll={handleClosePoll}
            onDelete={handleDeletePoll}
            page={page}
          />
        </div>

        <div className='ml-4 mt-3'>
          <p className='text-[15px] text-black leading-8'>{question}</p>

          <div className='mt-4'>
            {isVoteComplete || isPollClosed ? (
              <PollingResultContent
                type={type}
                options={pollResult.options}
                voters={pollResult.voters}
                responses={pollResult.responses}
              />
            ) : (
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
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default PollCard;
