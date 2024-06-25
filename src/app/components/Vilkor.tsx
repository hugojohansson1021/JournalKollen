'use client'
import React from 'react';
import { motion } from 'framer-motion';
/* eslint-disable react/no-unescaped-entities */

const Vilkorcontainer: React.FC<{ isSwedish: boolean; setIsSwedish: React.Dispatch<React.SetStateAction<boolean>> }> = ({ isSwedish, setIsSwedish }) => {
  const textConfig = {
    en: {
      
      terms: `
        Terms of Service

        1. Introduction
        Welcome to Journalkollen.se These terms of service ("Terms") govern your use of our service. By using the Webbapp, you accept these Terms in full. If you do not agree to these Terms, please refrain from using the Webbapp.

        2. Service Description
        Journalkollen.se offers a service where users can paste medical responses into an AI chatbot and receive simpler, more understandable translations. For each translation, we charge 39 SEK, payable via Swish.

        3. User Accounts
        3.1 Users do not need to, and cannot, create an account on the Webbapp to use the service.

        4. Payment
        4.1 Payment for each translated text is made via Swish.
        4.2 For questions regarding payment, refunds or cost issues, users are referred to our contact form on the website.

        5. Privacy and Data Security
        5.1 No data is stored with us. We cannot see what happens in the chat, meaning your medical responses are completely secure.
        5.2 The website uses SSL for data encryption to ensure all data sent via the Webbapp is protected.
        5.3 We do not store any data related to user interactions with the chatbot.

        6. Responsibility
        6.1 Users are fully responsible for the medical translations they receive from the chatbot. We do not guarantee the accuracy or completeness of the translations provided.
        6.2 Users are also responsible for the PDF responses that are automatically downloaded when the chat responds.

        7. Intellectual Property Rights
        7.1 The Webbapp and its original content, including the medical translation function, are copyright protected and belong to us. Any use of our content without permission is prohibited.

        8. Limitation of Liability
        8.1 To the extent permitted by law, we shall not be held liable for any indirect, incidental, special, consequential or punitive damages, including but not limited to lost profits, data loss, or other intangible losses, arising out of or in connection with your use of or inability to use the Webbapp.

        9. Changes to the Terms
        9.1 We reserve the right to, at our sole discretion, modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice before any new terms take effect. What constitutes a material change will be determined at our sole discretion.

        10. Contact Information
        If you have any questions about these Terms, please contact us via the contact form on our website.
      `,
    },
    sv: {
      
      terms: `
        Användarvillkor

        1. Introduktion
        Välkommen till Journalkollen.se  Dessa användarvillkor ("Villkoren") reglerar din användning av vår tjänst. Genom att använda Webbappen godkänner du dessa Villkor i sin helhet. Om du inte godkänner dessa Villkor, vänligen avstå från att använda Webbappen.

        2. Tjänstebeskrivning
        Journalkollen.se erbjuder en tjänst där användare kan klistra in läkarsvar i en AI-chatbot och få sitt läkarutlåtande översatt till enklare och mer förståelig text. För varje översättning debiterar vi 39 kr, vilket betalas via Swish.

        3. Användarkonton
        3.1 Användare behöver inte, och kan inte, skapa ett konto på Webbappen för att använda tjänsten.

        4. Betalning
        4.1 Betalning för varje översatt text sker via Swish.
        4.2 Vid frågor angående betalning, återbetalning eller kostnadsfrågor hänvisas användare till vårt kontaktformulär på webbplatsen.

        5. Sekretess och datasäkerhet
        5.1 Ingen data sparas hos oss. Vi kan inte se vad som händer i chatten, vilket innebär att dina läkarutlåtanden är helt säkra.
        5.2 Webbplatsen använder SSL för datakryptering för att säkerställa att all data som skickas via Webbappen är skyddad.
        5.3 Vi sparar ingen data relaterad till användarens interaktioner med chatbotten.

        6. Ansvar
        6.1 Användaren är helt ansvarig för den läkaröversättning som erhålls från chatbotten. Vi garanterar inte noggrannheten eller fullständigheten av de översättningar som tillhandahålls.
        6.2 Användaren är också ansvarig för de PDF-svar som automatiskt laddas ner när chatten svarar.

        7. Immateriella rättigheter
        7.1 Webbappen och dess ursprungliga innehåll, inklusive läkarsvarsöversättningsfunktionen, är upphovsrättsskyddade och tillhör oss. All användning av vårt innehåll utan tillstånd är förbjuden.

        8. Begränsning av ansvar
        8.1 I den utsträckning som tillåts enligt lag, ska vi inte hållas ansvariga för några indirekta, tillfälliga, speciella, följdskador eller straffskador, inklusive men inte begränsat till förlorade vinster, dataförluster, eller andra immateriella förluster, som uppstår från eller i samband med din användning av eller oförmåga att använda Webbappen.

        9. Ändringar av Villkoren
        9.1 Vi förbehåller oss rätten att, efter eget gottfinnande, ändra eller ersätta dessa Villkor när som helst. Om en revidering är väsentlig, kommer vi att försöka ge minst 30 dagars varsel innan nya villkor träder i kraft. Vad som utgör en väsentlig ändring kommer att bestämmas efter vårt eget gottfinnande.

        10. Kontaktinformation
        Om du har några frågor om dessa Villkor, vänligen kontakta oss via kontaktformuläret på vår webbplats.
      `,
    },
  };

  return (
    <section id='Vilkor' className=" py-12 w-full mt-14">
      <div className="max-w-7xl mx-auto">
        
          <div className="flex flex-col justify-center text-center">
            

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-gray-700 mr-5 ml-5 text-lg mb-2 font-sans text-left lg:pr-24 lg:pl-24"
            >
              <h2 className="text-2xl font-bold mb-4">{isSwedish ? 'Användarvillkor' : 'Terms of Service'}</h2>
              <p>{isSwedish ? textConfig.sv.terms : textConfig.en.terms}</p>
            </motion.div>
          </div>
        
      </div>
    </section>
  );
};

export default Vilkorcontainer;
