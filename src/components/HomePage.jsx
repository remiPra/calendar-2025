import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Système de Rendez-vous
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Prenez rendez-vous en quelques clics
          </p>
          <button
            className="bg-blue-600 text-white px-8 py-3 rounded-lg 
                       hover:bg-blue-700 transition duration-300"
            onClick={() => navigate('/booking')}
          >
            Prendre un rendez-vous
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;