import React, { FormEvent, useRef, useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
  const [question, setQuestion] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    { type: 'response', text: 'Jag är en chatbot som kan hjälpa dig förstå dina läkarsvar eller provsvar' },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [hasResponse, setHasResponse] = useState<boolean>(false);
  const [canvasImage, setCanvasImage] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState<boolean>(false); // State for the checkbox
  const bottomRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const pdfContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasResponse) {
      generateCanvasAndDownloadPdf();
    }
  }, [hasResponse]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isChecked) {
      toast.error('Kryssa i användarvillkoren först.');
      return;
    }

    setIsLoading(true);
    setError('');
    setHasResponse(false); // Reset the response state

    setMessages(prevMessages => [...prevMessages, { type: 'question', text: question }]);

    try {
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) {
        throw new Error(`Server svarade med status: ${res.status}`);
      }

      const data = await res.json();
      setMessages(prevMessages => [...prevMessages, { type: 'response', text: data.response }]);
      setHasResponse(true); // Set the response state to true
    } catch (err) {
      console.error('Ett fel inträffade:', err);
      setError('Ett fel inträffade vid hämtning av svaret.');
    } finally {
      setIsLoading(false);
      setQuestion('');
    }
  };

  const generateCanvasAndDownloadPdf = async () => {
    const pdfContent = pdfContentRef.current;
    if (!pdfContent) return;
  
    console.log('PDF content:', pdfContent.innerHTML); // Log content for debugging
  
    const pdf = new jsPDF('p', 'mm', 'a4');
    const margin = 10;
    const pdfWidth = pdf.internal.pageSize.getWidth() - margin * 2; // Adding margin
    const pdfHeight = pdf.internal.pageSize.getHeight() - margin * 2; // Adding margin
    const textSize = 12; // Set a text size that is readable on smaller screens
    const lineHeight = textSize * 1.05; // Line height for text, very close to text size
  
    pdf.setFontSize(textSize);
  
    const content = pdfContent.innerText; // Get the text content from the pdfContent div
    const textLines: string[] = pdf.splitTextToSize(content, pdfWidth); // Split the text content to fit within the page width
    let y = margin + textSize; // Start y position with a margin
  
    const watermarkImage = 'LogoGray.png'; // Replace with your watermark image path
  
    const addWatermark = (pdf: jsPDF, x: number, y: number) => {
      pdf.addImage(watermarkImage, 'PNG', x, y, 60, 30); // Adjust the size and position as needed
    };
  
    const addPageWithWatermark = (pdf: jsPDF) => {
      pdf.addPage();
      addWatermark(pdf, pdf.internal.pageSize.getWidth() - 70, 10); // Add watermark to new page
    };
  
    // Add watermark to the first page
    addWatermark(pdf, pdf.internal.pageSize.getWidth() - 70, 10);
  
    textLines.forEach((line: string) => {
      if (y + lineHeight > pdfHeight) { // Add a new page if the text exceeds the page height
        addPageWithWatermark(pdf);
        y = margin + textSize; // Reset y position for new page
      }
      pdf.text(line, margin, y);
      y += lineHeight;
    });
  
    pdf.save('Jounalkollen_AI_Svar.pdf');
  };
  
  return (
    <section className="mt-10 w-full sm:w-11/12 md:w-3/4 lg:w-2/3 xl:w-[900px] shadow-2xl" style={{ borderRadius: '20px' }}>
      <ToastContainer />
      <div className='' style={{ fontFamily: 'Arial, sans-serif', margin: 'auto', border: '2px solid #000000', borderRadius: '20px', overflow: 'hidden', borderColor: '#000', }}>
        <div style={{ padding: '10px', backgroundColor: '#c12043', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
          <h1 style={{ alignSelf: 'center', color: 'White' }}>{botName}</h1>
        </div>
        <div ref={chatContainerRef} className='border-black' style={{ height: '400px', overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#fff', }}>
          {messages.map((message, index) => (
            <div key={index} style={{ alignSelf: message.type === 'question' ? 'flex-end' : 'flex-start', backgroundColor: message.type === 'question' ? '#c12043' : '#c12043', borderRadius: '10px', padding: '10px', maxWidth: '80%', display: 'flex', alignItems: 'center', position: 'relative', opacity: '80%', }}>
              {message.type === 'response' && (
                <img src={botAvatarSrc} alt="Bot Avatar" style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }} />
              )}
              <p style={{ margin: 0, color: 'white' }} dangerouslySetInnerHTML={{ __html: message.text }}></p>
              <div
                style={{
                  position: 'absolute',
                  bottom: '-5px',
                  left: message.type === 'question' ? 'auto' : '10px',
                  right: message.type === 'question' ? '10px' : 'auto',
                  width: '10px',
                  height: '10px',
                  backgroundColor: '#c12043',
                  transform: message.type === 'question' ? 'rotate(45deg)' : 'rotate(-45deg)',
                }}
              />
            </div>
          ))}
          <div ref={bottomRef} />
          {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'center', height: '100px',  }}>
              <div className="dot-typing">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          )}
          {error && <p style={{ color: 'red', alignSelf: 'center' }}>{error}</p>}
        </div>
        <div className='text-gray-500 bg-white cursive text-center text-sm'> Svaret kan ta några sekunder  </div>
        <form onSubmit={handleSubmit} style={{
          display: 'flex', 
          flexDirection: 'column', 
          borderTop: '1px solid #000', 
          padding: '10px', 
          backgroundColor: '#f5f5f5', 
          color: '#666', 
          gap: '10px'
        }}>
          <textarea 
            value={question} 
            rows={3} 
            onChange={(e) => setQuestion(e.target.value)} 
            placeholder="Klistra in ditt läkarsvar här..." 
            disabled={isLoading} 
            style={{
              flexGrow: 1, 
              padding: '10px', 
              border: '1px solid #000000', 
              borderRadius: '10px', 
              fontSize: '12px', 
              minHeight: '130px'
            }} 
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className='text-black' style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <input type="checkbox" checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} style={{ marginRight: '10px', width: '30px', height: '30px' }} />
              <Link href="/Vilkor" legacyBehavior>
                <a style={{ color: 'black', textDecoration: 'underline', marginRight: '5px' }}>Användarvillkor</a>
              </Link>
              <span style={{ cursor: 'pointer' }} title="More information">ℹ️</span>
            </label>
            <button 
              type="submit" 
              disabled={isLoading} 
              style={{
                padding: '14px', 
                fontSize: '16px', 
                cursor: 'pointer', 
                border: 'none', 
                backgroundColor: '#c12043', 
                color: 'white', 
                borderRadius: '10px', 
                opacity: isLoading ? 0.5 : 1
              }}
            >
              Översätt text
            </button>
          </div>
        </form>
        <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderTop: '1px solid #ddd', textAlign: 'center' }}>
        </div>
        {/* Hidden div for PDF content */}
        <div style={{ position: 'absolute', top: '-9999px', left: '0', width: '100%', height: 'auto', overflow: 'hidden', opacity: 0 }}>
          <div ref={pdfContentRef} className='mb-15' style={{ color: 'black', fontSize: 'px', lineHeight: '1.8', padding: '20px' }}>
            {messages.filter(message => message.type === 'response' && message.text !== 'Jag är en chatbot som kan hjälpa dig förstå din läkar svar eller provsvar')
              .map((message, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                  <p dangerouslySetInnerHTML={{ __html: message.text }}></p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Chatbot;
