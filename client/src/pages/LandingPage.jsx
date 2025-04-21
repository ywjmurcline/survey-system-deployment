import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-blue-800 flex items-center justify-center">
      <div className="glass-effect p-8 rounded-2xl max-w-md w-full space-y-6">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          LivePoll
        </h1>

        <div className="space-y-4">
          <Link to="/create" className="primary-button block text-center">
            Create New Poll
          </Link>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-white/80">or</span>
            </div>
          </div>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Enter Room Code"
              className="modern-input"
            />
            <button type="submit" className="secondary-button w-full">
              Join Existing Poll
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;