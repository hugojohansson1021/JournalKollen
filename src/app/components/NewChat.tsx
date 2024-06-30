import React, { FormEvent, useRef, useState, useEffect } from 'react';
import { createWorker } from 'tesseract.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';

interface ChatbotProps {
  apiEndpoint: string;
  botName?: string;
  botAvatarSrc?: string;
}

interface Message {
  type: 'question' | 'response';
  text: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ apiEndpoint, botName = 'Journalkollen AI', botAvatarSrc = '/Doctor.png' }) => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { type: 'response', text: 'Jag är en chatbot som kan hjälpa dig förstå dina läkarsvar eller provsvar' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasResponse, setHasResponse] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const pdfContentRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (hasResponse) {
      generateAndDownloadPdf();
    }
  }, [hasResponse]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!isChecked) {
      toast.error('Kryssa i användarvillkoren först.');
      return;
    }
    if (!question && !file) {
      toast.error('Vänligen ange text eller ladda upp en fil.');
      return;
    }

    setIsLoading(true);
    setError('');
    setHasResponse(false);

    let textToSend = question;

    if (file) {
      if (file.type.startsWith('image/')) {
        try {
          const worker = await createWorker('eng');
          const { data: { text } } = await worker.recognize(file);
          await worker.terminate();
          textToSend = text;
        } catch (err) {
          console.error('Error processing image:', err);
          setError('Ett fel inträffade vid bearbetning av bilden.');
          setIsLoading(false);
          return;
        }
      } else if (file.type === 'application/pdf' || file.type === 'text/plain') {
        const text = await file.text();
        textToSend = text;
      }
    }

    try {
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: textToSend }),
      });

      if (!res.ok) {
        throw new Error(`Server svarade med status: ${res.status}`);
      }

      const data = await res.json();
      setMessages(prevMessages => [
        ...prevMessages,
        { type: 'question', text: file ? file.name : question },
        { type: 'response', text: data.response }
      ]);
      setHasResponse(true);
    } catch (err) {
      console.error('Ett fel inträffade:', err);
      setError('Ett fel inträffade vid hämtning av svaret.');
    } finally {
      setIsLoading(false);
      setQuestion('');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const generateAndDownloadPdf = () => {
    // ... (PDF generation code remains the same)
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{botName}</h1>
      <div ref={chatContainerRef} className="bg-gray-100 p-4 rounded-lg mb-4 h-96 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.type === 'response' ? 'text-blue-600' : 'text-gray-800'}`}>
            {message.type === 'response' && (
              <img src={botAvatarSrc} alt="Bot Avatar" className="w-8 h-8 rounded-full inline-block mr-2" />
            )}
            <span dangerouslySetInnerHTML={{ __html: message.text }}></span>
          </div>
        ))}
        {isLoading && <div className="text-gray-500">Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
      </div>
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Klistra in ditt läkarsvar här..."
          disabled={isLoading}
          className="w-full p-2 border border-gray-300 rounded"
          rows={4}
        />
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="mr-2 w-5 h-5"
          />
          <label>Jag godkänner användarvillkoren</label>
        </div>
        <input
          type="file"
          onChange={handleFileChange}
          ref={fileInputRef}
          accept=".txt,.pdf,.png,.jpg,.jpeg"
          className="mb-2"
        />
        {file && <div className="mb-2">Vald fil: {file.name}</div>}
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {file ? 'Ladda upp fil' : 'Översätt text'}
        </button>
      </form>
      <div ref={pdfContentRef} className="hidden">
        {messages.filter(message => message.type === 'response' && message.text !== 'Jag är en chatbot som kan hjälpa dig förstå dina läkarsvar eller provsvar')
          .map((message, index) => (
            <div key={index}>{message.text}</div>
          ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Chatbot;