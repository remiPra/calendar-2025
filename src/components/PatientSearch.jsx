import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchPatient } from '../services/patientService';

export default function PatientSearch() {
  const location = useLocation();
  const navigate = useNavigate();
  const { date, time } = location.state || {};
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  // Recherche en temps réel
  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (searchTerm.length >= 2) {
        setLoading(true);
        try {
          const searchResults = await searchPatient(searchTerm);
          setResults(searchResults);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 300); // Délai de 300ms pour éviter trop de requêtes

    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  const selectPatient = (patient) => {
    navigate('/patient-form', {
      state: {
        date,
        time,
        patientData: patient
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm mb-6">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button 
            onClick={() => navigate('/booking')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Retour au calendrier
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">
            Rechercher un patient existant
          </h2>

          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par nom ou téléphone"
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Résultats de recherche */}
            <div className="mt-4">
              {loading ? (
                <div className="text-center text-gray-600">Recherche...</div>
              ) : (
                <div className="space-y-2">
                  {results.map((patient) => (
                    <div
                      key={patient.id}
                      onClick={() => selectPatient(patient)}
                      className="p-3 border rounded hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <div className="font-medium">
                        {patient.Prenom} {patient.Nom}
                      </div>
                      <div className="text-sm text-gray-600">
                        {patient.telephone}
                      </div>
                      <div className="text-sm text-gray-600">
                        {patient.email}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t mt-4">
              <button
                onClick={() => navigate('/patient-form', { state: { date, time } })}
                className="w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200"
              >
                Nouveau patient
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}