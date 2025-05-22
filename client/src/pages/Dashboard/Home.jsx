import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import HeaderWithFilter from '../../components/layout/HeaderWithFilter';
import axiosInstace from '../../api/axiosInstance';
import { API_PATHS } from '../../api/config';
import PollCard from '../../components/PollCards/PollCard';

const PAGE_SIZE = 10;

const Home = () => {
  useUserAuth();

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
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstace.get(
        `${API_PATHS.POLLS.GET_ALL}?page=${overridePage}&limit=${PAGE_SIZE}&type=${filterType}`
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
      }
    } catch (error) {
      console.error(`Something went wrong. Please try again.`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchAllPolls();

    return () => {};
  }, [filterType]);

  useEffect(() => {
    if (page !== 1) {
      fetchAllPolls();
    }

    return () => {};
  }, [page]);

  return (
    <DashboardLayout activeMenu='Dashboard'>
      <div className='my-5 mx-auto'>
        <HeaderWithFilter
          title='Polls'
          filterType={filterType}
          setFilterType={setFilterType}
        />

        <InfiniteScroll
          dataLength={allPolls.length}
          next={loadMorePolls}
          hasMore={hasMore}
          loader={<h4 className='info-text'>loading...</h4>}
          endMessage={<p className='info-text'>No more polls to display</p>}>
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
            />
          ))}
        </InfiniteScroll>
      </div>
    </DashboardLayout>
  );
};

export default Home;
