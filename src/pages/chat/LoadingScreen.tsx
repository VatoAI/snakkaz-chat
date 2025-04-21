
const LoadingScreen = () => (
  <div className="fixed inset-0 bg-cyberdark-950 text-white flex items-center justify-center z-50">
    <div className="text-center p-4 max-w-md">
      <div className="w-16 h-16 border-4 border-t-cyberblue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-cyberblue-400">Laster inn SnakkaZ Chat...</p>
    </div>
  </div>
);
export { LoadingScreen };
