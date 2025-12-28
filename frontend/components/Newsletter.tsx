'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 3000);
  };

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs tracking-[0.3em] uppercase mb-4 text-gray-500">MANTENTE CONECTADA</p>
        <h2 className="text-4xl md:text-5xl font-light mb-6 text-gray-900">
          Únete a nuestra comunidad
        </h2>
        <p className="text-gray-600 mb-10 text-lg font-light max-w-2xl mx-auto">
          Recibe primero las nuevas colecciones, tendencias y ofertas exclusivas
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu email"
              required
              className="w-full px-6 py-4 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-black transition-colors text-center"
            />
            <button
              type="submit"
              disabled={subscribed}
              className={`w-full mt-6 py-4 text-sm tracking-wider uppercase font-medium transition-all ${
                subscribed
                  ? 'bg-black text-white'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {subscribed ? 'Suscrita ✓' : 'Suscribirse'}
            </button>
          </div>
        </form>
        
        <p className="text-gray-400 text-xs mt-8 tracking-wide">
          Al suscribirte, aceptas nuestra política de privacidad
        </p>
      </div>
    </section>
  );
}
