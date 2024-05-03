// eslint-disable-next-line react/prop-types
export const ButtonMap = ({ children, onClick }) => {
  return (
    <div onClick={onClick} className="mr-3">
      <button className="p-2 bg-slate-800 text-white rounded-md mb-2">
        {children}
      </button>
    </div>
  );
};
