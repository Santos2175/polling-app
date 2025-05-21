import CharAvatar from './CharAvatar';
import StatsInfo from './StatsInfo';

const UserDetailsCard = ({
  profileImageUrl,
  fullName,
  username,
  totalPollsVotes,
  totalPollsCreated,
  totalPollsBookmarked,
}) => {
  return (
    <div className='bg-slate-100/50 rounded-lg mt-16 overflow-hidden'>
      <div className='w-full h-32 flex justify-center bg-primary relative'>
        <div className='absolute -bottom-10 rounded-full overflow-hidden border-2 border-primary'>
          {profileImageUrl ? (
            <img
              src={profileImageUrl || ''}
              alt='Profile Image'
              className='w-20 h-20 rounded-full bg-slate-400'
            />
          ) : (
            <CharAvatar
              fullName={fullName}
              width='w-20'
              height='h-20'
              style='text-xl'
            />
          )}
        </div>
      </div>

      <div className='mt-12 px-5'>
        <div className='text-center pt-1'>
          <h5 className='text-lg text-gray-950 font-medium leading-6'>
            {fullName}
          </h5>
          <span className='text-[13px] font-medium text-slate-700/60'>
            @{username}
          </span>
        </div>

        <div className='flex items-center justify-center gap-5 flex-wrap my-6'>
          <StatsInfo label='Polls Created' value={totalPollsCreated || 0} />
          <StatsInfo label='Polls Voted' value={totalPollsVotes || 0} />
          <StatsInfo
            label='Polls Bookmarked'
            value={totalPollsBookmarked || 0}
          />
        </div>
      </div>
    </div>
  );
};

export default UserDetailsCard;
