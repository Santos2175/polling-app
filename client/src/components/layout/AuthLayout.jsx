import UI_ELEMENT from '../../assets/images/ui-element.png';
import CARD_1 from '../../assets/images/auth-card.png';

const AuthLayout = ({ children }) => {
  return (
    <div className='flex'>
      {/* Left part */}
      <div className='w-screen h-screen md:w-1/2 px-12 pt-8 pb-12'>
        <h2 className='text-lg font-medium text-black'>Polling App</h2>
        {children}
      </div>

      {/* Right part */}
      <div className='hidden md:block w-1/2 h-screen bg-sky-50 bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow-hidden relative'>
        <img src={UI_ELEMENT} className='w-[50%] absolute  -right-8 top-14' />
        <img
          src={UI_ELEMENT}
          className='w-[55%]  rotate-180 absolute -left-8 -bottom-[20%]'
        />

        <img
          src={CARD_1}
          className='w-64 h-56 lg:w-72 absolute top-[6%] left-[10%] shadow-xs shadow-blue-400/15'
        />
        <img
          src={CARD_1}
          className='w-64 h-56 lg:w-72 absolute top-[34%] left-[54%] shadow-xs shadow-blue-400/15'
        />
        <img
          src={CARD_1}
          className='w-64 h-56 lg:w-72 absolute top-[70%] left-[10%] shadow-xs shadow-blue-400/15'
        />
      </div>
    </div>
  );
};

export default AuthLayout;
