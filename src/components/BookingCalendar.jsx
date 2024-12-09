import { useState, useEffect } from 'react';  
import { useNavigate } from 'react-router-dom';  
import { format, isAfter, isBefore, startOfDay } from 'date-fns';  
import { fr } from 'date-fns/locale';  
import { collection, query, where, getDocs } from 'firebase/firestore';  
import { db } from '../firebase/config';  

const TimeSlot = ({ time, date, isBooked, isDisabled }) => {  
    const navigate = useNavigate();  

    const handleClick = () => {  
      if (!isBooked && !isDisabled) {  
        navigate('/patient-search', { state: { date, time } });  
      }  
    };  

    const getButtonClasses = () => {  
      if (isBooked) {  
        return "bg-gray-200 text-gray-500 cursor-not-allowed px-6 py-3 rounded-md font-medium";  
      }  
      if (isDisabled) {  
        return "bg-gray-100 text-gray-400 cursor-not-allowed px-6 py-3 rounded-md font-medium";  
      }  
      return "bg-blue-50 hover:bg-blue-100 px-6 py-3 rounded-md text-blue-900 font-medium";  
    };  

    return (  
      <button   
        className={getButtonClasses()}  
        onClick={handleClick}  
        disabled={isBooked || isDisabled}  
        title={isBooked ? 'Créneau déjà réservé' : isDisabled ? 'Créneau passé' : 'Disponible'}  
      >  
        {time}  
      </button>  
    );  
};  

const DaySlots = ({ date, slots, bookedSlots }) => {  
  const today = startOfDay(new Date());  
  const slotDate = startOfDay(new Date(date));  
  const isPastDate = isBefore(slotDate, today);  

  return (  
    <div className="border rounded-lg mb-4 p-4">  
      <div className="mb-4">  
        <span className="text-lg font-semibold">  
          {format(new Date(date), 'EEEE d MMMM', { locale: fr })}  
        </span>  
      </div>  
      <div className="grid grid-cols-4 gap-4">  
        {slots.map(time => {  
          const dateTime = new Date(`${date}T${time}`);  
          const isDisabled = isPastDate || isBefore(dateTime, new Date());  
          const isBooked = bookedSlots.includes(time);  

          return (  
            <TimeSlot   
              key={time}   
              time={time}  
              date={date}  
              isBooked={isBooked}  
              isDisabled={isDisabled}  
            />  
          );  
        })}  
      </div>  
    </div>  
  );  
};  

export default function BookingCalendar() {  
  const navigate = useNavigate();  
  const [dates, setDates] = useState([]);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);  
  const [bookedSlots, setBookedSlots] = useState({});  

  // Récupération des créneaux déjà réservés  
  const fetchBookedSlots = async (dates) => {  
    try {  
      const appointmentsRef = collection(db, 'appointments');  
      const bookings = {};  

      for (const date of dates) {  
        const q = query(appointmentsRef, where('date', '==', date));  
        const querySnapshot = await getDocs(q);  

        bookings[date] = [];  
        querySnapshot.forEach((doc) => {  
          const data = doc.data();  
          bookings[date].push(data.time);  
        });  
      }  

      setBookedSlots(bookings);  
    } catch (err) {  
      console.error('Erreur lors de la récupération des créneaux réservés:', err);  
      setError("Impossible de charger les créneaux disponibles");  
    }  
  };  

  useEffect(() => {  
    const generateDates = () => {  
      const dates = [];  
      const today = new Date();  
      for (let i = 0; i < 28; i++) {  
        const date = new Date(today);  
        date.setDate(today.getDate() + i);  
        if (date.getDay() === 4 || date.getDay() === 5) { // Jeudi ou Vendredi  
          dates.push(format(date, 'yyyy-MM-dd'));  
        }  
      }  
      return dates;  
    };  

    const initializeCalendar = async () => {  
      try {  
        const availableDates = generateDates();  
        setDates(availableDates);  
        await fetchBookedSlots(availableDates);  
      } catch (err) {  
        setError("Une erreur est survenue lors du chargement du calendrier");  
      } finally {  
        setLoading(false);  
      }  
    };  

    initializeCalendar();  
  }, []);  

  if (loading) {  
    return (  
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">  
        <div className="text-center">  
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>  
          <p className="mt-4">Chargement des créneaux...</p>  
        </div>  
      </div>  
    );  
  }  

  if (error) {  
    return (  
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">  
        <div className="text-center text-red-600 p-4 bg-white rounded-lg shadow">  
          <p>{error}</p>  
          <button   
            onClick={() => window.location.reload()}  
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"  
          >  
            Réessayer  
          </button>  
        </div>  
      </div>  
    );  
  }  

  const timeSlots = ['10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30'];  

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
        <div className="max-w-2xl mx-auto">  
          <h2 className="text-xl font-semibold mb-6">  
            Choisissez la date de consultation  
          </h2>  

          {dates.map((date) => (  
            <DaySlots   
              key={date}  
              date={date}  
              slots={timeSlots}  
              bookedSlots={bookedSlots[date] || []}  
            />  
          ))}  
        </div>  
      </main>  
    </div>  
  );  
}  