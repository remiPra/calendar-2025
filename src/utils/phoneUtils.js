// Ajoutez d'abord cette fonction utilitaire (par exemple dans src/utils/phoneUtils.js)  
export const formatPhoneForWhatsApp = (phone) => {  
    // Supprime tous les caractères non numériques  
    const cleanPhone = phone.replace(/[^\d+]/g, '');  
  
    // Si le numéro commence par '0', le remplacer par '+33'  s
    if (cleanPhone.startsWith('0')) {  
      return '+33' + cleanPhone.substring(1);  
    }  
  
    // Si le numéro ne commence pas par '+', ajouter '+'  
    if (!cleanPhone.startsWith('+')) {  
      return '+' + cleanPhone;  
    }  
  
    return cleanPhone;  
  };  
  
  // Dans votre page de confirmation (AppointmentConfirmation.jsx)  
  import { formatPhoneForWhatsApp } from '../utils/phoneUtils';  
  import { format } from 'date-fns';  
  import { fr } from 'date-fns/locale';  
  
  export default function AppointmentConfirmation() {  
    const location = useLocation();  
    const { appointmentData } = location.state || {};  
  
    const handleWhatsAppClick = () => {  
      if (!appointmentData?.patient?.telephone) return;  
  
      const phoneNumber = formatPhoneForWhatsApp(appointmentData.patient.telephone);  
      const formattedDate = format(new Date(appointmentData.date), 'EEEE d MMMM yyyy', { locale: fr });  
  
      // Préparer le message  
      const message = `Bonjour ${appointmentData.patient.prenom},\n\n`  
        + `Votre rendez-vous est confirmé pour le ${formattedDate} à ${appointmentData.time}.\n\n`  
        + `Motif : ${appointmentData.motif}\n`  
        + `Adresse : [Votre adresse]\n\n`  
        + `À bientôt !`;  
  
      // Encoder le message pour l'URL  
      const encodedMessage = encodeURIComponent(message);  
  
      // Créer l'URL WhatsApp  
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;  
  
      // Ouvrir WhatsApp dans un nouvel onglet  
      window.open(whatsappUrl, '_blank');  
    };  
  
    return (  
      <div className="min-h-screen bg-gray-100">  
        <div className="max-w-2xl mx-auto pt-10 px-4">  
          <div className="bg-white rounded-lg shadow-lg p-8">  
            {/* ... Autres éléments de confirmation ... */}  
  
            <div className="space-y-4 mt-6">  
              {/* Bouton WhatsApp */}  
              <button  
                onClick={handleWhatsAppClick}  
                className="w-full flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-md transition-colors"  
              >  
                {/* Icon WhatsApp (vous pouvez utiliser un SVG) */}  
                <svg   
                  className="w-6 h-6"   
                  fill="currentColor"   
                  viewBox="0 0 24 24"  
                >  
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>  
                </svg>  
                <span>Envoyer confirmation WhatsApp</span>  
              </button>  
  
              {/* Autres boutons ... */}  
            </div>  
          </div>  
        </div>  
      </div>  
    );  
  }  