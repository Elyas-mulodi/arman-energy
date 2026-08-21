import ContactInfoPanel from '@/components/contact/ContactInfoPanel';
import ContactForm from '@/components/contact/ContactForm';

export default function ContactPage() {
  return (
    <div className="grid min-h-[calc(100vh-64px)] grid-cols-1 md:grid-cols-2">
      <ContactInfoPanel />
      <div className="flex items-center justify-center bg-ink-100 px-6 py-12">
        <div className="w-full max-w-md rounded-xl border border-ink-800/10 bg-white p-8 shadow-sm">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}