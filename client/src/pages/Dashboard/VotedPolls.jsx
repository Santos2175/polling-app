import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import HeaderWithFilter from '../../components/layout/HeaderWithFilter';
import axiosInstace from '../../api/axiosInstance';
import { API_PATHS } from '../../api/config';
import PollCard from '../../components/PollCards/PollCard';
import EmptyCard from '../../components/cards/EmptyCard';
import CREATE_ICON from '../../assets/images/my-poll-icon.png';

const PAGE_SIZE = 10;

const VotedPolls = () => {
  useUserAuth();

  const navigate = useNavigate();

  const [votedPolls, setVotedPolls] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // Load more page for infinite scroll
  const loadMorePolls = () => {
    setPage((prevPage) => prevPage + 1);
  };

  // Fetch all polls from API
  const fetchAllPolls = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstace.get(`${API_PATHS.POLLS.VOTED_POLLS}`);

      if (response.data?.data.polls?.length > 0) {
        setVotedPolls((prevPolls) => [
          ...prevPolls,
          ...response.data.data.polls,
        ]);
        setHasMore(response.data.data.polls.length === PAGE_SIZE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error(`Something went wrong. Please try again.`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPolls();

    return () => {};
  }, [page]);

  return (
    <DashboardLayout activeMenu='Voted Polls'>
      <div className='my-5 mx-auto'>
        <h2 className='text-xl font-medium text-black'>Voted Polls</h2>

        {votedPolls.length === 0 && !loading && (
          <EmptyCard
            imgSrc={CREATE_ICON}
            message='You have not voted on any polls yet. Start exploring and share your opinions.'
            btnText='Explore'
            onClick={() => navigate('/dashboard')}
          />
        )}

        <InfiniteScroll
          dataLength={votedPolls.length}
          next={loadMorePolls}
          hasMore={hasMore}
          loader={<h4 className='info-text'>loading...</h4>}
          endMessage={
            votedPolls.length ? (
              <p className='info-text'>No more polls to display</p>
            ) : (
              ''
            )
          }>
          {votedPolls.map((poll) => (
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
          ))}
        </InfiniteScroll>
      </div>
    </DashboardLayout>
  );
};

export default VotedPolls;
