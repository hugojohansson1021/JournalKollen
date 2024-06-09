import React, { FormEvent, useRef, useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ChatbotProps {
  apiEndpoint: string;
  botName?: string;
  botAvatarSrc?: string;
}

interface Message {
  type: 'question' | 'response';
  text: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ apiEndpoint, botName = 'Journal Förklaring AI', botAvatarSrc = '/Doctor.png' }) => {
  const [question, setQuestion] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    { type: 'response', text: 'Jag är en chatbot som kan hjälpa dig förstå din läkar svar eller provsvar' },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [hasResponse, setHasResponse] = useState<boolean>(false);
  const [canvasImage, setCanvasImage] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState<boolean>(false); // State for the checkbox
  const bottomRef = useRef<HTMLDivElement>(null);
  const pdfContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasResponse) {
      generateCanvasAndDownloadPdf();
    }
  }, [hasResponse]);

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

    // Set a fixed width for the PDF content to ensure consistent text size
    const originalWidth = pdfContent.style.width;
    pdfContent.style.width = '800px';

    const scale = 2; // Use a higher scale factor for better resolution
    const canvas = await html2canvas(pdfContent, { backgroundColor: '#ffffff', scale: scale });
    const imgData = canvas.toDataURL('image/png');
    setCanvasImage(imgData); // Set the canvas image to render it on the screen for debugging

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth() - 20; // Adding margin
    const pdfHeight = pdf.internal.pageSize.getHeight() - 20; // Adding margin
    let imgProps = pdf.getImageProperties(imgData);
    let imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 10;

    pdf.addImage(imgData, 'PNG', 10, position, pdfWidth, imgHeight);
    pdf.setFontSize(10);
    pdf.setTextColor(150);
    pdf.text('Journalkollen.se', pdf.internal.pageSize.getWidth() - 50, 10); // Add watermark
    heightLeft -= pdfHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, pdfWidth, imgHeight);
      pdf.text('Journalkollen.se', pdf.internal.pageSize.getWidth() - 50, 10); // Add watermark to each page
      heightLeft -= pdfHeight;
    }

    pdf.save('AI_Response.pdf');

    // Reset the width of the PDF content
    pdfContent.style.width = originalWidth;
  };

  return (
    <section className="mt-10 w-full sm:w-11/12 md:w-3/4 lg:w-2/3 xl:w-[900px] shadow-2xl" style={{ borderRadius: '20px' }}>
      <ToastContainer />
      <div className='' style={{ fontFamily: 'Arial, sans-serif', margin: 'auto', border: '2px solid #000000', borderRadius: '20px', overflow: 'hidden', borderColor: '#000', }}>
        <div style={{ padding: '10px', backgroundColor: '#c12043', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
          <h1 style={{ alignSelf: 'center', color: 'White' }}>{botName}</h1>
        </div>
        <div className='border-black' style={{ height: '500px', overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#fff', }}>
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
            <div style={{ display: 'flex', justifyContent: 'flex-start', height: '100px',  }}>
              <div className="dot-typing">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          )}
          {error && <p style={{ color: 'red', alignSelf: 'center' }}>{error}</p>}
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', borderTop: '1px solid #000', padding: '10px', backgroundColor: '#f5f5f5', color: '#666' }}>
          <textarea value={question} rows={3} onChange={(e) => setQuestion(e.target.value)} placeholder="Klistra in ditt läkarsvar här..." disabled={isLoading} style={{ flexGrow: 1, padding: '10px', marginRight: '10px', border: '1px solid #000000', borderRadius: '10px', fontSize: '16px' }} />
          <button type="submit" disabled={isLoading} style={{ padding: '5px 10px', fontSize: '16px', cursor: 'pointer', border: 'none', backgroundColor: '#c12043', color: 'white', borderRadius: '10px', opacity: isLoading ? 0.5 : 1 }}>
            Översätt text
          </button>
        </form>
        <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderTop: '1px solid #ddd', textAlign: 'center' }}>
          <label className='text-black' style={{ marginLeft: '10px', display: 'flex', alignItems: 'center', position: 'relative' }}>
            <input type="checkbox" checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} style={{ marginRight: '5px' }} />
            Användarvillkor
            <div style={{ visibility: isChecked ? 'visible' : 'hidden', position: 'absolute', top: '-30px', left: '0', backgroundColor: '#c12043', color: 'white', padding: '5px', borderRadius: '5px', fontSize: '12px', whiteSpace: 'nowrap' }}>
              Användarvillkoren måste kryssas
            </div>
          </label>
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
        {/* Render the canvas on the screen for debugging */}
        {canvasImage && (
          <div style={{ marginTop: '20px', textAlign: 'center', marginBottom: '20px', }}>
            <h2>Canvas Preview</h2>
            <img src={canvasImage} alt="Canvas Preview" style={{ border: '1px solid #000' }} />
          </div>
        )}
      </div>
    </section>
  );
};

export default Chatbot;


