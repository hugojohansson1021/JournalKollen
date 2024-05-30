import React, { FormEvent, useRef, useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  const bottomRef = useRef<HTMLDivElement>(null);
  const pdfContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasResponse) {
      generateCanvasAndDownloadPdf();
    }
  }, [hasResponse]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
    heightLeft -= pdfHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save('AI_Response.pdf');
  };

  return (
    <section className="bg-white mt-10 w-full sm:w-11/12 md:w-3/4 lg:w-2/3 xl:w-[900px] shadow-2xl" style={{ borderRadius: '20px' }}>
      <div className='' style={{ fontFamily: 'Arial, sans-serif', margin: 'auto', border: '2px solid #000000', borderRadius: '20px', overflow: 'hidden', borderColor: '#000', }}>
        <div style={{ padding: '10px', backgroundColor: '#e31837', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
          <h1 style={{ alignSelf: 'center', color: 'White' }}>{botName}</h1>
        </div>
        <div className='border-black' style={{ height: '500px', overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#fff', }}>
          {messages.map((message, index) => (
            <div key={index} style={{ alignSelf: message.type === 'question' ? 'flex-end' : 'flex-start', backgroundColor: message.type === 'question' ? '#e31837' : '#e31837', borderRadius: '10px', padding: '10px', maxWidth: '80%', display: 'flex', alignItems: 'center', position: 'relative', opacity: '80%', }}>
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
                  backgroundColor: '#e31837',
                  transform: message.type === 'question' ? 'rotate(45deg)' : 'rotate(-45deg)',
                }}
              />
            </div>
          ))}
          <div ref={bottomRef} />
          {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
              <div className="dot-flashing">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          )}
          {error && <p style={{ color: 'red', alignSelf: 'center' }}>{error}</p>}
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', borderTop: '1px solid #000', padding: '10px', backgroundColor: '#f5f5f5', color: '#666' }}>
        <textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Skriv din fråga här" disabled={isLoading} style={{ flexGrow: 1, padding: '10px', marginRight: '10px', border: '1px solid #000000', borderRadius: '10px', fontSize: '16px' }} />
          <button type="submit" disabled={isLoading} style={{ padding: '10px 15px', fontSize: '16px', cursor: 'pointer', border: 'none', backgroundColor: '#e31837', color: 'white', borderRadius: '10px' }}>
            Sök
          </button>
        </form>
        <button onClick={generateCanvasAndDownloadPdf} disabled={!hasResponse} style={{ margin: '10px', padding: '10px 15px', fontSize: '16px', cursor: 'pointer', border: 'none', backgroundColor: '#e31837', color: 'white', borderRadius: '10px', opacity: hasResponse ? 1 : 0.5 }}>
          Ladda ner PDF
        </button>
        {/* Hidden div for PDF content */}
        <div style={{ position: 'absolute', top: '-9999px', left: '0', width: '100%', height: 'auto', overflow: 'hidden', opacity: 0 }}>
          <div ref={pdfContentRef} style={{ color: 'black', fontSize: '22px', lineHeight: '1.8', padding: '20px' }}>
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
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <h2>Canvas Preview</h2>
            <img src={canvasImage} alt="Canvas Preview" style={{ border: '1px solid #000' }} />
          </div>
        )}
      </div>
    </section>
  );
};

export default Chatbot;


