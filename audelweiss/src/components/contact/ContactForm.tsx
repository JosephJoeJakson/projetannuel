'use client';

import { useEffect, useState, useRef } from 'react';
import { fetchContactFields, submitContactForm, ContactField } from '@/services/contact';

export default function ContactForm() {
    const [fields, setFields] = useState<ContactField[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        fetchContactFields()
            .then((fetchedFields) => {
                console.log('Fetched fields:', fetchedFields);
                setFields(fetchedFields);
            })
            .catch((err) => {
                console.error('Failed to fetch contact fields:', err);
                setError('Impossible de charger le formulaire de contact.');
            })
            .finally(() => setLoading(false));
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data: Record<string, string> = {};
        
        fields.forEach((field) => {
            const value = formData.get(field.name);
            data[field.name] = value ? String(value) : '';
        });

        console.log('Fields:', fields);
        console.log('Form data being sent:', data);

        try {
            await submitContactForm(data);
            setSuccess(true);
            if (formRef.current) {
                formRef.current.reset();
            }
        } catch (err) {
            console.error('Submission error:', err);
            setError('Une erreur est survenue lors de l\'envoi du message.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-gray-600">Chargement du formulaire...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="btn-primary"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    if (success) {
        return (
            <div className="text-center py-8">
                <div className="text-green-600 mb-4">
                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <h2 className="text-xl font-semibold mb-2">Message envoyé !</h2>
                    <p>Merci pour votre message. Nous vous répondrons dans les plus brefs délais.</p>
                </div>
                <button 
                    onClick={() => setSuccess(false)} 
                    className="btn-secondary"
                >
                    Envoyer un autre message
                </button>
            </div>
        );
    }

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {fields.map((field) => (
                <div key={field.id}>
                    <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    
                    {field.type === 'textarea' ? (
                        <textarea
                            id={field.name}
                            name={field.name}
                            required={field.required}
                            placeholder={field.placeholder}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                    ) : (
                        <input
                            id={field.name}
                            name={field.name}
                            type={field.type}
                            required={field.required}
                            placeholder={field.placeholder}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                    )}
                </div>
            ))}
            
            <button 
                type="submit" 
                disabled={submitting}
                className={`w-full btn-primary ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {submitting ? (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Envoi en cours...
                    </div>
                ) : (
                    'Envoyer le message'
                )}
            </button>
        </form>
    );
} 