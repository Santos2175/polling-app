import UI_ELEMENT from '../../assets/images/ui-element.png';
import CARD_1 from '../../assets/images/auth_card1.png';
import CARD_2 from '../../assets/images/auth_card2.png';
import CARD_3 from '../../assets/images/auth_card3.png';

const AuthLayout = ({ children }) => {
  return (
    <div className='flex'>
      {/* Left part */}
      <div className='w-screen h-screen md:w-1/2 px-12 pt-8 pb-12'>
        <h2 className='text-lg font-medium text-black'>BuzzPoll</h2>
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
          className='w-52  lg:h-32 lg:w-80 absolute top-[6%] left-[10%] shadow-lg shadow-blue-400/45 object-contain'
        />
        <img
          src={CARD_2}
          className='w-64 lg:h-38 lg:w-88 absolute top-[34%] left-[50%] shadow-lg shadow-blue-400/45 object-contain'
        />
        <img
          src={CARD_3}
          className='w-64  lg:h-44 lg:w-96 absolute top-[65%] left-[10%] shadow-lg shadow-blue-400/45 object-contain'
        />
      </div>
    </div>
  );
};

export default AuthLayout;
