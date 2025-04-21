import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PollCreator from '../components/presenter/PollCreator';
import LiveResults from '../components/common/LiveResults';

function PresenterDashboard() {
  const { roomId } = useParams();
  const [polls, setPolls] = useState([]);
  const [activePoll, setActivePoll] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Room Code: <span className="text-indigo-600">{roomId}</span>
          </h2>
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
            Participants: 42
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PollCreator onCreate={setActivePoll} />
          {activePoll && <LiveResults poll={activePoll} />}
        </div>
      </div>
    </div>
  );
};

export default PresenterDashboard;