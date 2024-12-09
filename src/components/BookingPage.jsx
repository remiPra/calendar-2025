// src/components/BookingPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingCalendar from './BookingCalendar';

const PatientForm = ({ onSubmit, onBack, loading }) => {
 const [formData, setFormData] = useState({
   name: '',
   firstName: '', 
   email: '',
   phone: ''
 });

 const handleSubmit = async (e) => {
   e.preventDefault();
   try {
     // Simuler l'envoi
     await onSubmit(formData);
   } catch (error) {
     alert("Erreur lors de la soumission du formulaire");
   }
 };

 return (
   <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
     <div className="mb-6">
       <button 
         onClick={onBack}
         className="flex items-center text-gray-600 hover:text-gray-900"
       >
         <span className="mr-2">←</span> Retour aux créneaux
       </button>
     </div>

     <h2 className="text-xl font-semibold mb-6">Vos informations</h2>
     
     <form onSubmit={handleSubmit} className="space-y-4">
       <div>
         <label className="block text-sm font-medium text-gray-700">Nom</label>
         <input
           type="text"
           value={formData.name}
           onChange={(e) => setFormData({...formData, name: e.target.value})}
           className="mt-1 block w-full rounded-md border border-gray-300 p-2"
           required
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
         />
       </div>

       <button
         type="submit"
         disabled={loading}
         className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
       >
         {loading ? 'Confirmation...' : 'Confirmer le rendez-vous'}
       </button>
     </form>
   </div>
 );
};

export default function BookingPage() {
 const navigate = useNavigate();
 const [step, setStep] = useState('calendar');
 const [selectedSlot, setSelectedSlot] = useState(null);
 const [loading, setLoading] = useState(false);

 const handleSlotSelect = (date, time) => {
  console.log("handleSlotSelect appelé avec:", date, time);
  setSelectedSlot({ date, time });
  console.log("selectedSlot mis à jour:", { date, time });
  setStep('form');
  console.log("étape changée à 'form'");
};

 const handlePatientSubmit = async (patientInfo) => {
   setLoading(true);
   try {
     console.log("Patient info:", patientInfo);
     console.log("Selected slot:", selectedSlot);
     // Ici vous ajouterez la logique de réservation
     navigate('/');
   } catch (error) {
     alert("Erreur lors de la réservation");
   } finally {
     setLoading(false);
   }
 };

 return (
   <div className="min-h-screen bg-gray-100">
     <header className="bg-white shadow-sm mb-6">
       <div className="max-w-7xl mx-auto px-4 py-4">
         <button 
           onClick={() => navigate('/')}
           className="text-gray-600 hover:text-gray-900"
         >
           ← Retour à l'accueil
         </button>
       </div>
     </header>

     <main className="max-w-7xl mx-auto px-4 py-6">
       {step === 'calendar' ? (
         <BookingCalendar onSelectSlot={handleSlotSelect} />
       ) : (
         <PatientForm 
           onSubmit={handlePatientSubmit}
           onBack={() => setStep('calendar')}
           loading={loading}
         />
       )}
     </main>
   </div>
 );
}