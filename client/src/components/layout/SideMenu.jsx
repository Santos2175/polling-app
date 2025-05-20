import { useNavigate } from 'react-router-dom';
import { SIDE_MENU_DATA } from '../../utils/data';
import { useUser } from '../../hooks/useUser';

const SideMenu = ({ activeMenu }) => {
  const { clearUser } = useUser();
  const navigate = useNavigate();

  // Function to navigate through dashboard menu item
  const handleClick = (route) => {
    if (route === '/logout') {
      handleLogout();
      return;
    }

    navigate(route);
  };

  // Function to handle logout event
  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate('/login');
  };

  return (
    <div className='w-64 h-[calc(100vh-61px)] bg-slate-50/50 border-r border-r-slate-100/70 p-5 sticky top-[61px] z-20'>
      {SIDE_MENU_DATA.map((item, index) => (
        <button
          key={`menu_${index}`}
          onClick={() => handleClick(item.path)}
          className={`w-full flex items-center gap-4 text-[15px] ${
            activeMenu === item.label ? 'text-white bg-primary' : ''
          } px-6 py-4 rounded-full mb-3 cursor-pointer`}>
          <item.icon className='text-xl' />
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default SideMenu;
