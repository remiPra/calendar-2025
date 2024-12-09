// src/services/appointmentService.js
import { db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const FIXED_SLOTS = ['10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30'];

export const getAvailableSlots = async (date) => {
  try {
    const docRef = doc(db, 'appointments', date);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return FIXED_SLOTS;
    }

    const bookedSlots = docSnap.data().slots || {};
    return FIXED_SLOTS.filter(time => !bookedSlots[time]?.booked);
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
};

export const bookAppointment = async (date, time, patientInfo) => {
  const docRef = doc(db, 'appointments', date);
  
  try {
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const slots = docSnap.data().slots || {};
      if (slots[time]?.booked) {
        throw new Error('Créneau déjà réservé');
      }
    }

    await setDoc(docRef, {
      date,
      slots: {
        ...(docSnap.exists() ? docSnap.data().slots : {}),
        [time]: {
          booked: true,
          patientName: patientInfo.name,
          patientPhone: patientInfo.phone
        }
      }
    }, { merge: true });

    return true;
  } catch (error) {
    console.error('Erreur de réservation:', error);
    throw error;
  }
};