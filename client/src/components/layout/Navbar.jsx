import { useState } from 'react';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import SideMenu from './SideMenu';

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <div className='flex gap-5 border-b border-b-white bg-slate-50/50 backdrop-blur-[3px] p-4 sticky top-0 z-30'>
      <button
        className='block lg:hidden text-black cursor-pointer'
        onClick={() => setOpenSideMenu(!openSideMenu)}>
        {openSideMenu ? (
          <HiOutlineX className='text-2xl' />
        ) : (
          <HiOutlineMenu className='text-2xl' />
        )}
      </button>
      <h2 className='text-lg font-medium text-black'>BuzzPoll</h2>

      {openSideMenu && (
        <div className='fixed top-[61px] -ml-4 bg-white'>
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
