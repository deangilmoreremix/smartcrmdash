import React from 'react';

const ClientLogos: React.FC = () => {
  const logos = [
    { name: "TechCorp", initial: "TC" },
    { name: "InnovateCo", initial: "IC" },
    { name: "GlobalTech", initial: "GT" },
    { name: "StartupInc", initial: "SI" },
    { name: "Enterprise", initial: "EN" },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-gray-600 mb-8">Trusted by leading companies worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {logos.map((logo, index) => (
              <div key={index} className="flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="font-bold text-gray-500">{logo.initial}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;
