import CharAvatar from './CharAvatar';
import { formatDistanceToNow } from 'date-fns';

const UserProfileInfo = ({ imgUrl, fullName, username, createdAt }) => {
  return (
    <div className='flex items-center gap-4'>
      {imgUrl ? (
        <img
          src={imgUrl}
          alt=''
          className='w-10 h-10 rounded-full border-none'
        />
      ) : (
        <CharAvatar fullName={fullName} style='text-[13px]' />
      )}

      <div>
        <p className='text-sm text-black font-medium leading-4'>
          {fullName} <span className='mx-1 text-sm text-slate-500'>•</span>
          <span className='text-[10px]  text-slate-500'>
            {createdAt &&
              formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>
        </p>
        <span className='text-[11.5px] text-slate-500'>@{username}</span>
      </div>
    </div>
  );
};

export default UserProfileInfo;
