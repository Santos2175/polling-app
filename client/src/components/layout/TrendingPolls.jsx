const TrendingPolls = ({ stats }) => {
  return (
    <div className='bg-slate-100/50 rounded-lg mt-6 overflow-hidden sticky top-[80px] p-5'>
      <h6 className='text-sm font-medium text-black'>Trending</h6>
      <div className='mt-4'>
        {stats.map((item) => (
          <div className='flex items-center justify-between rounded-lg mb-1 px-3 py-2 hover:bg-slate-300/30 cursor-pointer'>
            <p className='text-xs text-slate-900'>{item.label}</p>
            <span className='text-xs text-slate-600 rounded px-4 py-[6px]'>
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingPolls;
