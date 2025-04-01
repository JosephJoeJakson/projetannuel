'use client';
import { useEffect, useState } from 'react';

type Field = {
  label: string;
  name: string;
  type: string;
  required: boolean;
  placeholder?: string;
};

export default function ContactForm() {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3390/api/contacts-fields?sort=order:asc')
      .then(res => res.json())
      .then(data => {
        console.log("Fetched contact fields:", data); // ✅ Debug
        const items = data.data
          .map((item: any) => item?.attributes)
          .filter((field: any) => field && field.name && field.label); // ✅ Safe filter
        setFields(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch fields:", err);
        setError("Unable to load the contact form.");
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData: Record<string, string> = {};
    fields.forEach((field) => {
      formData[field.name] = e.target[field.name].value;
    });

    try {
      const res = await fetch('http://localhost:3390/api/contact-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { data: formData } }),
      });

      if (!res.ok) throw new Error('Failed to submit');

      setSuccess(true);
      e.target.reset();
    } catch (err) {
      console.error("Submission error:", err);
      setError("There was a problem submitting the form.");
    }
  };

  if (loading) return <p className="text-gray-500">Loading form...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (success) return <p className="text-green-600">Your message has been sent successfully!</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="block font-medium mb-1">{field.label}</label>
          {field.type === 'textarea' ? (
            <textarea
              id={field.name}
              name={field.name}
              required={field.required}
              placeholder={field.placeholder || ''}
              className="w-full border rounded p-2"
            />
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              required={field.required}
              placeholder={field.placeholder || ''}
              className="w-full border rounded p-2"
            />
          )}
        </div>
      ))}
      <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
        Send
      </button>
    </form>
  );
}
