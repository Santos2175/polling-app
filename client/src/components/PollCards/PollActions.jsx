import { useState } from 'react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { HiMenu } from 'react-icons/hi';

const PollActions = ({
  isVoteComplete,
  inputCaptured,
  onVoteSubmit,
  isBookmarked,
  toggleBookmark,
  isMyPoll,
  pollClosed,
  onClosePoll,
  onDelete,
  page,
}) => {
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleVoteClick = async () => {
    setLoading(true);
    try {
      await onVoteSubmit();
    } catch (error) {
      console.error('Vote submission failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const actionButtons = (
    <>
      {isMyPoll && !pollClosed && (
        <button
          className='btn-small text-orange-500 bg-orange-500/20 hover:bg-orange-500 hover:text-white'
          onClick={onClosePoll}
          disabled={loading}>
          Close
        </button>
      )}
      {isMyPoll && (
        <button
          className='btn-small text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white'
          onClick={onDelete}
          disabled={loading}>
          Delete
        </button>
      )}
    </>
  );

  return (
    <div className='flex items-center gap-1 sm:gap-4'>
      {(isVoteComplete || pollClosed) && (
        <div className='text-[11px] font-medium text-slate-600 bg-sky-700/10 px-3 py-1 rounded-md'>
          {pollClosed ? 'Closed' : 'Voted'}
        </div>
      )}

      {/* Mobile menu button */}
      {page === 'MyPolls' && (
        <div className='sm:hidden relative'>
          <button
            className='bg-sky-700/10 p-1 text-slate-600 rounded-md'
            onClick={() => setShowMenu((prev) => !prev)}>
            <HiMenu />
          </button>

          {showMenu && (
            <div className='absolute top-[110%] -left-6 bg-sky-100 p-2 rounded-md z-10 flex flex-col gap-1 shadow'>
              {actionButtons}
            </div>
          )}
        </div>
      )}

      {/* Desktop action buttons */}
      <div className='hidden sm:flex gap-4'>{actionButtons}</div>

      {/* Bookmark */}
      <button className='icon-btn' onClick={toggleBookmark}>
        {isBookmarked ? (
          <FaBookmark className='text-primary' />
        ) : (
          <FaRegBookmark />
        )}
      </button>

      {/* Submit vote */}
      {inputCaptured && !isVoteComplete && (
        <button
          className='btn-small ml-auto'
          onClick={handleVoteClick}
          disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      )}
    </div>
  );
};

export default PollActions;
