import React, { FormEvent, useRef, useState, useEffect } from 'react';
import { createWorker } from 'tesseract.js';
import jsPDF from 'jspdf';
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

const Chatbot: React.FC<ChatbotProps> = ({ 
    apiEndpoint, 
    botName = <span className=" text-[#c12043]">Journalkollen AI</span>, 
    botAvatarSrc = '/Doctor.png' 
  }) => {
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

  const stripHtmlTags = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  const formatPdfContent = (content: string) => {
    const sections = content.split(/(?=Sammanfattning|Förklaring)/);
    let formattedContent = '';

    sections.forEach(section => {
      const lines = section.split('\n');
      let sectionContent = '';

      lines.forEach(line => {
        if (line.trim().startsWith('Sammanfattning') || line.trim().startsWith('Förklaring')) {
          sectionContent += `\n\n${line.trim()}\n\n`;
        } else if (line.trim().startsWith('-')) {
          sectionContent += `\n${line.trim()}\n`;
        } else {
          sectionContent += `${line.trim()} `;
        }
      });

      formattedContent += sectionContent.trim() + '\n\n';
    });

    return formattedContent.trim();
  };

  const generateAndDownloadPdf = () => {
    const pdfContent = pdfContentRef.current;
    if (!pdfContent) return;
  
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    const titleSize = 16;
    const textSize = 12;
    const lineHeight = textSize * 1.5;
  
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(titleSize);
    pdf.text("Journalkollen AI Svar", pageWidth / 2, margin, { align: "center" });
  
    let y = margin + titleSize + 10;
  
    const addWatermark = () => {
      pdf.addImage('LogoGray.png', 'PNG', pageWidth - 90, pageHeight - 50, 70, 30);
    };
  
    const addPage = () => {
      pdf.addPage();
      addWatermark();
      return margin;
    };
  
    addWatermark();
  
    const renderFormattedText = (text: string) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const elements = doc.body.childNodes;
  
      elements.forEach((element) => {
        if (element.nodeType === Node.ELEMENT_NODE) {
          const tagName = (element as Element).tagName.toLowerCase();
          const innerText = (element as Element).textContent || '';
  
          switch (tagName) {
            case 'p':
              const lines = pdf.splitTextToSize(innerText, contentWidth);
              lines.forEach((line: string) => {
                if (y + lineHeight > pageHeight - margin) {
                  y = addPage();
                }
                pdf.setFont("helvetica", "normal");
                pdf.setFontSize(textSize);
                pdf.text(line, margin, y);
                y += lineHeight;
              });
              y += lineHeight / 2; // Add some space after paragraphs
              break;
            case 'strong':
            case 'b':
              pdf.setFont("helvetica", "bold");
              pdf.setFontSize(textSize);
              pdf.text(innerText, margin, y);
              y += lineHeight;
              break;
            case 'em':
            case 'i':
              pdf.setFont("helvetica", "italic");
              pdf.setFontSize(textSize);
              pdf.text(innerText, margin, y);
              y += lineHeight;
              break;
            case 'ul':
            case 'ol':
              (element as Element).querySelectorAll('li').forEach((li, index) => {
                const bulletPoint = tagName === 'ul' ? '• ' : `${index + 1}. `;
                const listItemText = bulletPoint + (li.textContent || '');
                const listItemLines = pdf.splitTextToSize(listItemText, contentWidth - 5);
                listItemLines.forEach((line: string, lineIndex: number) => {
                  if (y + lineHeight > pageHeight - margin) {
                    y = addPage();
                  }
                  pdf.setFont("helvetica", "normal");
                  pdf.setFontSize(textSize);
                  pdf.text(lineIndex === 0 ? line : '  ' + line, margin, y);
                  y += lineHeight;
                });
              });
              y += lineHeight / 2; // Add some space after lists
              break;
            default:
              const defaultLines = pdf.splitTextToSize(innerText, contentWidth);
              defaultLines.forEach((line: string) => {
                if (y + lineHeight > pageHeight - margin) {
                  y = addPage();
                }
                pdf.setFont("helvetica", "normal");
                pdf.setFontSize(textSize);
                pdf.text(line, margin, y);
                y += lineHeight;
              });
          }
        } else if (element.nodeType === Node.TEXT_NODE && element.textContent?.trim()) {
          const lines = pdf.splitTextToSize(element.textContent.trim(), contentWidth);
          lines.forEach((line: string) => {
            if (y + lineHeight > pageHeight - margin) {
              y = addPage();
            }
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(textSize);
            pdf.text(line, margin, y);
            y += lineHeight;
          });
        }
      });
    };
  
    const responseMessages = messages.filter(
      message => message.type === 'response' && 
      message.text !== 'Jag är en chatbot som kan hjälpa dig förstå dina läkarsvar eller provsvar'
    );
  
    responseMessages.forEach((message, index) => {
      if (index > 0) {
        y = addPage(); // Start each response on a new page
      }
      renderFormattedText(message.text);
    });
  
    pdf.save('Journalkollen_AI_Svar.pdf');
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{botName}</h1>
      <div ref={chatContainerRef} className="bg-white p-4 rounded-lg mb-4 h-96 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 rounded-md py-2 px-3 max-w-[80%] ${
            message.type === 'response' 
              ? 'bg-[#faeef0] text-[#c12043] self-start mr-auto' 
              : 'bg-[#e6f3ff] text-[#0066cc] self-end ml-auto'
          }`}>
            {message.type === 'response' && (
              <img src={botAvatarSrc} alt="Bot Avatar" className="w-8 h-8 rounded-full inline-block mr-2" />
            )}
            <span dangerouslySetInnerHTML={{ __html: message.text }}></span>
          </div>
        ))}
        {isLoading && <div className="text-gray-500">Svaret kan ta några sekunder</div>}
        {error && <div className="text-red-500">{error}</div>}
      </div>
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Klistra in ditt läkarsvar här..."
          disabled={isLoading}
          className="w-full p-2 border border-gray-300 rounded mb-2"
          rows={4}
          style={{
            flexGrow: 1,
            padding: '10px',
            border: '1px solid #000000',
            borderRadius: '10px',
            fontSize: '12px',
            minHeight: '130px',
            color:'#000'
          }}
        />
        <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
  <div className="relative inline-block">
    <input
      type="checkbox"
      id="terms"
      checked={isChecked}
      onChange={(e) => setIsChecked(e.target.checked)}
      className="hidden"
    />
    <label
      htmlFor="terms"
      className="flex items-center cursor-pointer before:content-[''] before:w-[30px] before:h-[30px] before:border before:border-red-500 before:rounded before:mr-2 before:bg-white"
    >
      <span className={`absolute left-[9px] top-[5px] w-[12px] h-[20px] border-r-4 border-b-4 border-red-500 transform rotate-45 ${isChecked ? 'opacity-100' : 'opacity-0'}`}></span>
    </label>
  </div>
  <label htmlFor="terms" className="text-black cursor-pointer">Användarvillkor</label>
  <Link href="/Vilkor" className="ml-2">ℹ️</Link>
</div>
          <input
            type="file"
            onChange={handleFileChange}
            ref={fileInputRef}
            accept=".txt,.pdf,.png,.jpg,.jpeg"
            className="w-1/2 text-black"
          />
        </div>
        {file && <div className="mb-2 text-black">Vald fil: {file.name}</div>}
        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#c12043] text-white px-4 py-2 rounded hover:bg-[#ac5568] w-full"
        >
          {isLoading ? 'Bearbetar...' : 'Översätt'}
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