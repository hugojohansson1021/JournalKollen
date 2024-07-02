import React, { FormEvent, useRef, useState, useEffect } from 'react';
import { createWorker } from 'tesseract.js';
import jsPDF from 'jspdf';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import LoadingComponent from './smallComponents/LoadingComponent';

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
    botName = <span className=" text-[#c12043] block text-center text-4xl mt-12 ">Journalkollen AI</span>, 
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
    const margin = 10;
    const contentWidth = pageWidth - margin * 2;
    const titleSize = 16;
    const textSize = 11;
    const lineHeight = textSize * 0.5;
  
    let pageNumber = 1;
    let totalPages = 0;
  
    const wrapText = (text: string, maxWidth: number): string[] => {
      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = '';
  
      words.forEach(word => {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const testWidth = pdf.getStringUnitWidth(testLine) * textSize / pdf.internal.scaleFactor;
        
        if (testWidth > maxWidth) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });
  
      if (currentLine) {
        lines.push(currentLine);
      }
  
      return lines;
    };
  
    // First pass to count total pages
    const countPages = () => {
      let y = margin + titleSize + 10;
      const responseMessages = messages.filter(
        message => message.type === 'response' && 
        message.text !== 'Jag är en chatbot som kan hjälpa dig förstå dina läkarsvar eller provsvar'
      );
      responseMessages.forEach((message, index) => {
        if (index > 0) {
          totalPages++;
          y = margin;
        }
        const lines = wrapText(message.text.replace(/\*/g, ''), contentWidth);
        lines.forEach(() => {
          if (y + lineHeight > pageHeight - margin) {
            totalPages++;
            y = margin;
          }
          y += lineHeight;
        });
        y += lineHeight * 3;
      });
      totalPages++;
    };
  
    countPages();
  
    const addPageNumber = () => {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.text(`${pageNumber} (${totalPages})`, pageWidth - margin, pageHeight - margin, { align: "right" });
      pageNumber++;
    };
  
    const addWatermark = () => {
      pdf.addImage('LogoGray.png', 'PNG', pageWidth - 70, pageHeight - 35, 55, 25);
    };
  
    const addPage = () => {
      pdf.addPage();
      addWatermark();
      addPageNumber();
      return margin;
    };
  
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(titleSize);
    pdf.text("Journalkollen AI Svar", pageWidth / 2, margin, { align: "center" });
  
    let y = margin + titleSize + 10;
  
    addWatermark();
    addPageNumber();
  
    const renderFormattedText = (text: string) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(text.replace(/\*/g, ''), 'text/html');
      const elements = doc.body.childNodes;
  
      elements.forEach((element) => {
        if (element.nodeType === Node.ELEMENT_NODE) {
          const tagName = (element as Element).tagName.toLowerCase();
          const innerText = ((element as Element).textContent || '').replace(/\*/g, '');
  
          switch (tagName) {
            case 'p':
            case 'strong':
            case 'b':
            case 'em':
            case 'i':
              pdf.setFont("helvetica", tagName === 'strong' || tagName === 'b' ? "bold" : tagName === 'em' || tagName === 'i' ? "italic" : "normal");
              pdf.setFontSize(textSize);
              const lines = wrapText(innerText, contentWidth);
              lines.forEach((line: string) => {
                if (y + lineHeight > pageHeight - margin) {
                  y = addPage();
                }
                pdf.text(line, margin, y);
                y += lineHeight;
              });
              y += lineHeight * 2; // Increased spacing after paragraphs
              break;
            case 'ul':
            case 'ol':
              (element as Element).querySelectorAll('li').forEach((li, index) => {
                const bulletPoint = tagName === 'ul' ? '• ' : `${index + 1}. `;
                const listItemText = bulletPoint + (li.textContent || '').replace(/\*/g, '');
                const listItemLines = wrapText(listItemText, contentWidth - 5);
                listItemLines.forEach((line: string, lineIndex: number) => {
                  if (y + lineHeight > pageHeight - margin) {
                    y = addPage();
                  }
                  pdf.setFont("helvetica", "normal");
                  pdf.setFontSize(textSize);
                  pdf.text(line, margin + (lineIndex === 0 ? 0 : 5), y);
                  y += lineHeight;
                });
              });
              y += lineHeight * 2; // Increased spacing after lists
              break;
          }
        } else if (element.nodeType === Node.TEXT_NODE && element.textContent?.trim()) {
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(textSize);
          const lines = wrapText(element.textContent.trim().replace(/\*/g, ''), contentWidth);
          lines.forEach((line: string) => {
            if (y + lineHeight > pageHeight - margin) {
              y = addPage();
            }
            pdf.text(line, margin, y);
            y += lineHeight;
          });
          y += lineHeight; // Add space after text nodes
        }
      });
    };
  
    const responseMessages = messages.filter(
      message => message.type === 'response' && 
      message.text !== 'Jag är en chatbot som kan hjälpa dig förstå dina läkarsvar eller provsvar'
    );
  
    responseMessages.forEach((message, index) => {
      if (index > 0) {
        y = addPage();
      }
      renderFormattedText(message.text);
      y += lineHeight * 3; // Add extra space between different messages
    });
  
    pdf.save('Journalkollen_AI_Svar.pdf');
  };



  const LoadingAnimation = () => (
    <div className="flex justify-center items-center space-x-2 mb-2">
        <div className='my-0 mx-0'>Loading</div>
      <div className="w-2 h-2 bg-[#c12043] rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-[#c12043] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-2 h-2 bg-[#c12043] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
    </div>
  );



  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{botName}</h1>
      <div ref={chatContainerRef} className="bg-white p-4 rounded-lg mb-4 h-96 overflow-y-auto shadow-lg relative">
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
        {isLoading && (
          <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-70">
            <LoadingComponent />
          </div>
        )}
        {error && <div className="text-red-500">{error}</div>}
      </div>
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Klistra in ditt läkarsvar här..."
          disabled={isLoading}
          className="w-full p-2 border border-gray-100 rounded mb-2 shadow-md"
          rows={4}
          style={{
            flexGrow: 1,
            padding: '10px',
            border: '1px solid #dddddd',
            borderRadius: '10px',
            fontSize: '12px',
            minHeight: '130px',
            color:'#000',
            
          }}
        />
        <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
        <div className="dark:bg-black/10">
  <label className="text-white">
    <input
      type="checkbox"
      id="terms"
      checked={isChecked}
      onChange={(e) => setIsChecked(e.target.checked)}
      className="dark:border-white-400/20 dark:scale-100 transition-all duration-500 ease-in-out dark:hover:scale-110 dark:checked:scale-100 w-10 h-10"
    />
  </label>
</div>
  <label htmlFor="terms" className="text-black cursor-pointer ml-2">Användarvillkor</label>
  <Link href="/Vilkor" className="ml-2">ℹ️</Link>
</div>



<div className="grid w-44 max-w-xs items-center gap-1.5">
  <input
    className="flex w-full rounded-md border border-red-300 border-input bg-white text-sm text-gray-400 file:border-0 file:bg-[#c12043] file:text-white file:text-sm file:font-medium"
    type="file"
    id="picture"
    onChange={handleFileChange}
    ref={fileInputRef}
    accept=".txt,.pdf,.png,.jpg,.jpeg"
  />
</div>



        </div>
        
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