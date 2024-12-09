// src/services/patientService.js
import { db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const searchPatient = async (searchTerm) => {
  try {
    const patientsRef = collection(db, 'patients');
    let results = [];

    // Recherche par téléphone
    const phoneQuery = query(patientsRef, where('telephone', '==', searchTerm));
    const phoneSnapshot = await getDocs(phoneQuery);
    
    // Recherche par nom (en majuscules comme dans votre base)
    const nameQuery = query(patientsRef, where('Nom', '==', searchTerm.toUpperCase()));
    const nameSnapshot = await getDocs(nameQuery);

    phoneSnapshot.forEach(doc => {
      results.push({ id: doc.id, ...doc.data() });
    });
    
    nameSnapshot.forEach(doc => {
      results.push({ id: doc.id, ...doc.data() });
    });

    return results;
  } catch (error) {
    console.error('Erreur lors de la recherche du patient:', error);
    throw error;
  }
};