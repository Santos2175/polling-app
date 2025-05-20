import { useUser } from '../../hooks/useUser';
import UserDetailsCard from '../cards/UserDetailsCard';
import Navbar from './Navbar';
import SideMenu from './SideMenu';

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useUser();

  return (
    <div>
      <Navbar />

      {user && (
        <div className='flex'>
          <div className='max-[1080px]:hidden'>
            <SideMenu activeMenu={activeMenu} />
          </div>

          <div className='grow mx-5'>{children}</div>

          <div className='hidden md:block mr-5'>
            <UserDetailsCard
              profileImageUrl={user && user.profileImageUrl}
              username={user && user.username}
              fullName={user && user.fullName}
              totalPollsVotes={user && user.totalPollsVotes}
              totalPollsCreated={user && user.totalPollsCreated}
              totalPollsBookmarked={user && user.totalPollsBookmarked}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
