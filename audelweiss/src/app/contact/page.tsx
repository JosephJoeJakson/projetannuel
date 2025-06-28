import ContactForm from '@/components/contact/ContactForm';
import SectionTitle from '@/components/common/SectionTitle';

export default function ContactPage() {
    return (
        <main className="max-w-4xl mx-auto px-4 py-8">
            <SectionTitle>Contact</SectionTitle>
            
            <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div>
                    <h2 className="text-2xl font-semibold text-primary mb-4">Parlons de votre projet</h2>
                    <p className="text-gray-600 mb-6">
                        Vous avez une question, une demande particulière ou souhaitez discuter d'un projet sur mesure ? 
                        N'hésitez pas à me contacter, je serai ravi(e) de vous répondre dans les plus brefs délais.
                    </p>
                    
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-medium">Email</p>
                                <p className="text-gray-600">contact@audelweiss.com</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-medium">Réponse</p>
                                <p className="text-gray-600">Sous 24-48h</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <ContactForm />
                </div>
            </div>
        </main>
    );
}
