import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../components/shared/Input';
import Button from '../components/shared/Button';
import { useAlert } from '../hooks/useAlert';
import { Mail, User, MessageSquareText, Send } from 'lucide-react'; // Changed Subject to MessageSquareText

const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addAlert } = useAlert();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !subject.trim() || !message.trim()) {
      addAlert('Please fill in Email, Subject, and Message fields.', 'error');
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    addAlert('Your message has been sent (mock). We\'ll get back to you soon!', 'success');
    // Reset form
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setIsSubmitting(false);
  };

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-primary-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-black min-h-full">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 md:p-10 rounded-xl shadow-2xl">
        <header className="mb-8 text-center">
          <Mail size={48} className="mx-auto text-primary-500 mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Contact Us</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Have questions or feedback? We'd love to hear from you!
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="contact-name"
            label="Your Name (Optional)"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            leftIcon={<User size={18} className="text-gray-400"/>}
          />
          <Input
            id="contact-email"
            label="Your Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            leftIcon={<Mail size={18} className="text-gray-400"/>}
          />
          <Input
            id="contact-subject"
            label="Subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            placeholder="Regarding..."
            leftIcon={<MessageSquareText size={18} className="text-gray-400"/>} 
          />
          <div>
            <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Message
            </label>
            <textarea
              id="contact-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              placeholder="Your message here..."
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 sm:text-sm transition-colors duration-150"
            />
          </div>
          <Button 
            type="submit" 
            variant="primary" 
            className="w-full" 
            isLoading={isSubmitting}
            leftIcon={<Send size={18}/>}
            size="lg"
            glowing={true}
          >
            {isSubmitting ? 'Sending Message...' : 'Send Message'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;