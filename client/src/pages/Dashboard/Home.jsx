import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import HeaderWithFilter from '../../components/layout/HeaderWithFilter';
import axiosInstace from '../../api/axiosInstance';
import { API_PATHS } from '../../api/config';

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
      </div>
    </DashboardLayout>
  );
};

export default Home;
