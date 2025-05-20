const StatsInfo = ({ label, value }) => {
  return (
    <div className='text-center'>
      <p className='font-medium text-gray-950'>{value}</p>
      <p className='text-xs text-slate-700/80 mt-[2px]'>{label}</p>
    </div>
  );
};

export default StatsInfo;
