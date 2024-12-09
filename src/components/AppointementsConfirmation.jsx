// src/components/AppointmentConfirmation.jsx  
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const formatPhoneForWhatsApp = (phone) => {
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    if (cleanPhone.startsWith('0')) {
        return '+33' + cleanPhone.substring(1);
    }
    return cleanPhone.startsWith('+') ? cleanPhone : '+' + cleanPhone;
};

export default function AppointmentConfirmation() {
    const location = useLocation();
    const navigate = useNavigate();
    const { appointmentData } = location.state || {};
    const [countdown, setCountdown] = useState(30); // Augmenté à 30s pour laisser le temps d'utiliser WhatsApp  

    useEffect(() => {
        if (!appointmentData) {
            navigate('/booking');
            return;
        }

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/');
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [appointmentData, navigate]);


    // Dans AppointmentConfirmation.jsx, ajoutez cette fonction  

    const handleSMSClick = () => {  
          if (!appointmentData?.patient?.telephone) return;  
        
          const phoneNumber = formatPhoneForWhatsApp(appointmentData.patient.telephone);  
          const message = `Confirmation RDV: ${formattedDate} à ${appointmentData.time}`;  
        
          // Utiliser window.open() au lieu de window.location.href  
          const smsUrl = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;  
          window.open(smsUrl, '_blank');  
        };  

    // Dans le JSX, ajoutez le bouton SMS à côté du bouton WhatsApp  








    const handleWhatsAppClick = () => {
        if (!appointmentData?.patient?.telephone) return;

        const phoneNumber = formatPhoneForWhatsApp(appointmentData.patient.telephone);
        const formattedDate = format(new Date(appointmentData.date), 'EEEE d MMMM yyyy', { locale: fr });

        const message = `Bonjour ${appointmentData.patient.prenom},\n\n`
            + `Votre rendez-vous est confirmé pour le ${formattedDate} à ${appointmentData.time}.\n\n`
            + `Cabinet de PRADERE Remi Pédicure Podologue `
            + `4 bis rue honoré cazaubon 32100 condom\n\n`
            + `tel : +33619727540\n\n`
            //   + `ℹ️ Motif : ${appointmentData.motif || 'Consultation'}\n\n`  
            //   + `📝 Notes : ${appointmentData.notes || 'Aucune note particulière'}\n\n`  
            + `Pour modifier ou annuler votre rendez-vous, merci de nous contacter au moins 24h à l'avance.\n\n`
            + `À bientôt !`;

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    if (!appointmentData) return null;

    const { date, time, patient } = appointmentData;
    const formattedDate = format(new Date(date), 'EEEE d MMMM yyyy', { locale: fr });

    return (
        <div className="min-h-screen bg-gray-100 py-12">
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* En-tête avec icône de succès */}
                    <div className="bg-green-50 p-6 text-center">
                        <div className="mx-auto h-16 w-16 mb-4">
                            <svg className="h-full w-full text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-green-800">Rendez-vous confirmé !</h2>
                    </div>

                    {/* Contenu principal */}
                    <div className="p-6">
                        {/* Détails du rendez-vous */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-4">Détails du rendez-vous</h3>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-lg font-medium text-gray-900">
                                    {formattedDate} à {time}
                                </p>
                                {appointmentData.motif && (
                                    <p className="text-gray-600 mt-2">
                                        Motif : {appointmentData.motif}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Informations du patient */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-4">Vos informations</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Nom</p>
                                    <p className="font-medium">{patient.nom}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Prénom</p>
                                    <p className="font-medium">{patient.prenom}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Email</p>
                                    <p className="font-medium">{patient.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Téléphone</p>
                                    <p className="font-medium">{patient.telephone}</p>
                                </div>
                            </div>
                        </div>

                        {/* Boutons d'action */}
                        <div className="space-y-4">
                            {/* Bouton WhatsApp */}
                            <button
                                onClick={handleWhatsAppClick}
                                className="w-full flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#128C7E] text-white py-3 px-4 rounded-lg transition-colors"
                            >
                                {/* ... Icon WhatsApp ... */}
                                <span>Recevoir sur WhatsApp</span>
                            </button>

                            {/* Nouveau Bouton SMS */}
                            <button
                                onClick={handleSMSClick}
                                className="w-full flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span>Recevoir par SMS</span>
                            </button>
                        </div>
                        <div className="space-y-4">
                            {/* Bouton WhatsApp */}
                            <button
                                onClick={handleWhatsAppClick}
                                className="w-full flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#128C7E] text-white py-3 px-4 rounded-lg transition-colors"
                            >
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                <span>Recevoir la confirmation sur WhatsApp</span>
                            </button>

                            {/* Bouton d'impression */}
                            <button
                                onClick={() => window.print()}
                                className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                <span>Imprimer la confirmation</span>
                            </button>
                        </div>

                        {/* Compte à rebours */}
                        <div className="mt-8 text-center text-sm text-gray-500">
                            Redirection automatique dans {countdown} secondes
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}  