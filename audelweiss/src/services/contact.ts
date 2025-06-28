import { getRequest } from '../../lib/strapi';

export interface ContactField {
    id: number;
    label: string;
    name: string;
    type: 'text' | 'textarea' | 'email' | 'tel';
    required: boolean;
    placeholder?: string;
    order: number;
}

export interface ContactSubmission {
    id: number;
    data: Record<string, any>;
}

export async function fetchContactFields(): Promise<ContactField[]> {
    const data = await getRequest('contacts-fields?sort=order:asc');
    console.log('Raw contact fields data:', data); // Debug
    return data?.data?.map((item: any) => ({
        id: item.id,
        label: item.label || '',
        name: item.name || '',
        type: item.type || 'text',
        required: item.required || false,
        placeholder: item.placeholder || '',
        order: item.order || 0
    })).filter((field: ContactField) => field.name && field.label) || [];
}

export async function submitContactForm(formData: Record<string, string>): Promise<ContactSubmission> {
    console.log('Submitting form data:', formData); // Debug
    const response = await fetch('http://localhost:3090/api/contact-submissions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            data: {
                data: formData
            }
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to submit contact form');
    }

    const result = await response.json();
    return result.data;
} 