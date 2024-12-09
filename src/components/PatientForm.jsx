import { useState } from 'react';  
import { useLocation, useNavigate } from 'react-router-dom';  
import { db } from '../firebase/config';  
import { collection, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';  

export default function PatientForm() {  
    const location = useLocation();  
    const navigate = useNavigate();  
    const { date, time, patientData } = location.state || {};  

    const [formData, setFormData] = useState({  
      name: patientData?.Nom || '',  
      firstName: patientData?.Prenom || '',  
      email: patientData?.email || '',  
      phone: patientData?.telephone || '',  
      motif: '', // Nouveau champ pour le motif  
      notes: ''  // Nouveau champ pour les notes supplémentaires  
    });  
    const [loading, setLoading] = useState(false);  
    const [error, setError] = useState(null);  

    // Validation du formulaire  
    const validateForm = () => {  
      const errors = [];  
      if (!formData.name) errors.push("Le nom est requis");  
      if (!formData.firstName) errors.push("Le prénom est requis");  
      if (!formData.email) errors.push("L'email est requis");  
      if (!formData.phone) errors.push("Le téléphone est requis");  
    //   if (!formData.motif) errors.push("Le motif est requis");  

      if (errors.length > 0) {  
        throw new Error(errors.join('\n'));  
      }  
    };  

    const handleSubmit = async (e) => {  
      e.preventDefault();  
      setLoading(true);  
      setError(null);  

      try {  
        validateForm();  

        // Préparer les données du rendez-vous  
        const appointmentData = {  
          date,  
          time,  
          motif: formData.motif,  
          notes: formData.notes,  
          status: 'confirmé',  
          createdAt: new Date().toISOString()  
        };  

        // Préparer les données du patient  
        const patientInfo = {  
          Nom: formData.name.toUpperCase(),  
          Prenom: formData.firstName,  
          email: formData.email.toLowerCase(),  
          telephone: formData.phone  
        };  

        let patientId;  

        if (patientData?.id) {  
          // Mise à jour d'un patient existant  
          const patientRef = doc(db, 'patients', patientData.id);  
          await updateDoc(patientRef, patientInfo);  
          patientId = patientData.id;  
        } else {  
          // Création d'un nouveau patient  
          const patientRef = await addDoc(collection(db, 'patients'), patientInfo);  
          patientId = patientRef.id;  
        }  

        // Ajout des informations du patient au rendez-vous  
        appointmentData.patientId = patientId;  
        appointmentData.patientInfo = patientInfo;  

        // Création du rendez-vous  
        const appointmentRef = await addDoc(collection(db, 'appointments'), appointmentData);  

        // Redirection vers la page de confirmation  
        navigate('/confirmation', {  
          state: {  
            appointmentData: {  
              id: appointmentRef.id,  
              date,  
              time,  
              motif: formData.motif,  
              notes: formData.notes,  
              patient: {  
                nom: formData.name.toUpperCase(),  
                prenom: formData.firstName,  
                email: formData.email,  
                telephone: formData.phone  
              }  
            }  
          }  
        });  

      } catch (err) {  
        setError(err.message);  
        console.error('Erreur lors de la soumission:', err);  
      } finally {  
        setLoading(false);  
      }  
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
            <h2 className="text-xl font-semibold mb-6">Informations du rendez-vous</h2>  
            <p className="mb-6 text-gray-600">  
              Rendez-vous le {date} à {time}  
            </p>  

            {error && (  
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">  
                {error}  
              </div>  
            )}  

            <form onSubmit={handleSubmit} className="space-y-4">  
              {/* Informations personnelles */}  
              <div className="space-y-4">  
                <h3 className="text-lg font-medium">Informations personnelles</h3>  

                <div>  
                  <label className="block text-sm font-medium text-gray-700">Nom</label>  
                  <input  
                    type="text"  
                    value={formData.name}  
                    onChange={(e) => setFormData({...formData, name: e.target.value})}  
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"  
                    required  
                    disabled={loading}  
                  />  
                </div>  

                <div>  
                  <label className="block text-sm font-medium text-gray-700">Prénom</label>  
                  <input  
                    type="text"  
                    value={formData.firstName}  
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}  
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"  
                    required  
                    disabled={loading}  
                  />  
                </div>  

                <div>  
                  <label className="block text-sm font-medium text-gray-700">Email</label>  
                  <input  
                    type="email"  
                    value={formData.email}  
                    onChange={(e) => setFormData({...formData, email: e.target.value})}  
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"  
                    required  
                    disabled={loading}  
                  />  
                </div>  

                <div>  
                  <label className="block text-sm font-medium text-gray-700">Téléphone</label>  
                  <input  
                    type="tel"  
                    value={formData.phone}  
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}  
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"  
                    required  
                    disabled={loading}  
                  />  
                </div>  
              </div>  

              {/* Informations du rendez-vous */}  
              <div className="space-y-4 pt-6">  
                <h3 className="text-lg font-medium">Détails du rendez-vous</h3>  

                <div>  
                  <label className="block text-sm font-medium text-gray-700">  
                    Motif du rendez-vous  
                  </label>  
                  <select  
                    value={formData.motif}  
                    onChange={(e) => setFormData({...formData, motif: e.target.value})}  
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"  
                    // required  
                    disabled={loading}  
                  >  
                    <option value="">Sélectionnez un motif</option>  
                    <option value="consultation">Consultation générale</option>  
                    <option value="suivi">Suivi</option>  
                    <option value="urgence">Urgence</option>  
                    <option value="autre">Autre</option>  
                  </select>  
                </div>  

                <div>  
                  <label className="block text-sm font-medium text-gray-700">  
                    Notes supplémentaires  
                  </label>  
                  <textarea  
                    value={formData.notes}  
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}  
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"  
                    rows="3"  
                    disabled={loading}  
                    placeholder="Informations complémentaires..."  
                  />  
                </div>  
              </div>  

              <button  
                type="submit"  
                className={`w-full ${  
                  loading   
                    ? 'bg-blue-400 cursor-not-allowed'   
                    : 'bg-blue-600 hover:bg-blue-700'  
                } text-white py-2 rounded transition-colors mt-6`}  
                disabled={loading}  
              >  
                {loading ? 'Confirmation en cours...' : 'Confirmer le rendez-vous'}  
              </button>  
            </form>  
          </div>  
        </main>  
      </div>  
    );  
}  