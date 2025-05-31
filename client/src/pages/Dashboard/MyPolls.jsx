import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import HeaderWithFilter from '../../components/layout/HeaderWithFilter';
import axiosInstace from '../../api/axiosInstance';
import { API_PATHS } from '../../api/config';
import PollCard from '../../components/PollCards/PollCard';
import { useUser } from '../../hooks/useUser';
import EmptyCard from '../../components/cards/EmptyCard';
import CREATE_ICON from '../../assets/images/my-poll-icon.png';

const PAGE_SIZE = 10;

const MyPolls = () => {
  useUserAuth();

  const { user } = useUser();

  const navigate = useNavigate();

  const [allPolls, setAllPolls] = useState([]);
  const [stats, setStats] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [filterType, setFilterType] = useState('');

  // Load more page for infinite scroll
  const loadMorePolls = () => {
    setPage((prevPage) => prevPage + 1);
  };

  // Fetch all polls from API
  const fetchAllPolls = async (overridePage = page) => {
    if (loading && !user?._id) return;

    setLoading(true);

    try {
      const response = await axiosInstace.get(
        `${API_PATHS.POLLS.GET_ALL}?page=${overridePage}&limit=${PAGE_SIZE}&type=${filterType}&creatorId=${user._id}`
      );

      if (response.data?.data.polls?.length > 0) {
        setAllPolls((prevPolls) =>
          overridePage === 1
            ? response.data.data.polls
            : [...prevPolls, ...response.data.data.polls]
        );
        setStats(response.data?.data.stats || []);
        setHasMore(response.data.data.polls.length === PAGE_SIZE);
      } else {
        setHasMore(false);
        setAllPolls([]);
      }
    } catch (error) {
      console.error(`Something went wrong. Please try again.`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      setPage(1);
      fetchAllPolls(1);
    }

    return () => {};
  }, [filterType, user?._id]);

  useEffect(() => {
    if (page !== 1) {
      fetchAllPolls();
    }

    return () => {};
  }, [page]);

  return (
    <DashboardLayout activeMenu='My Polls'>
      <div className='my-5 mx-auto'>
        <HeaderWithFilter
          title='My Polls'
          filterType={filterType}
          setFilterType={setFilterType}
        />

        {allPolls.length === 0 && !loading && (
          <EmptyCard
            imgSrc={CREATE_ICON}
            message="Welcome! You're the first user of the system and there are no polls yet. Start by creating the first poll."
            btnText='Create Poll'
            onClick={() => navigate('/create-poll')}
          />
        )}

        <InfiniteScroll
          dataLength={allPolls?.length}
          next={loadMorePolls}
          hasMore={hasMore}
          loader={<h4 className='info-text'>loading...</h4>}
          endMessage={
            allPolls.length ? (
              <p className='info-text'>No more polls to display</p>
            ) : (
              ''
            )
          }>
          {allPolls.map((poll) => (
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
              isMyPoll
              page='MyPolls'
            />
          ))}
        </InfiniteScroll>
      </div>
    </DashboardLayout>
  );
};

export default MyPolls;
