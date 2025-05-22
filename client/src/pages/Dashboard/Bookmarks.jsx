import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import axiosInstace from '../../api/axiosInstance';
import { API_PATHS } from '../../api/config';
import PollCard from '../../components/PollCards/PollCard';
import EmptyCard from '../../components/cards/EmptyCard';
import CREATE_ICON from '../../assets/images/my-poll-icon.png';
import { useUser } from '../../hooks/useUser';

const Bookmarks = () => {
  useUserAuth();

  const { user } = useUser();
  const navigate = useNavigate();

  const [bookmarkedPolls, setBookmarkedPolls] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchAllPolls = useCallback(async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstace.get(`${API_PATHS.POLLS.BOOKMARKED}`);
      const bookmarks = response.data?.bookmarkedPolls || [];
      if (bookmarks.length > 0) {
        setBookmarkedPolls((prevPolls) => {
          const uniqueBookmarks = bookmarks.filter(
            (bookmark) =>
              !prevPolls.some((prevPoll) => prevPoll._id === bookmark._id)
          );

          return [...prevPolls, ...uniqueBookmarks];
        });
      }
    } catch (error) {
      console.error(`Something went wrong. Please try again.`, error);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    fetchAllPolls();

    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu='Bookmarks'>
      <div className='my-5 mx-auto'>
        <h2 className='text-xl font-medium text-black'>Bookmarks</h2>

        {bookmarkedPolls.length === 0 && !loading && (
          <EmptyCard
            imgSrc={CREATE_ICON}
            message='You have not added any bookmarks yet. Start exploring and add to your bookmarks.'
            btnText='Explore'
            onClick={() => navigate('/dashboard')}
          />
        )}

        {loading ? (
          <h4 className='info-text'>loading...</h4>
        ) : (
          <>
            {bookmarkedPolls.map((poll) => {
              if (!user?.bookmarkedPolls.includes(poll._id)) return null;

              return (
                <PollCard
                  key={`dashboard_${poll._id}`}
                  pollId={poll._id}
                  type={poll.type}
                  question={poll.question}
                  options={poll.options}
                  voters={poll.voters.length || 0}
                  responses={poll.responses || []}
                  creatorProfileImg={poll.creator.profileImageUrl || null}
                  creatorName={poll.creator.fullName}
                  creatorUsername={poll.creator.username}
                  userHasVoted={poll.userHasVoted || false}
                  isPollClosed={poll.closed || false}
                  createdAt={poll.createdAt || null}
                />
              );
            })}
            {bookmarkedPolls.length > 0 ? (
              <p className='info-text'>No more polls to display</p>
            ) : (
              ''
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Bookmarks;
