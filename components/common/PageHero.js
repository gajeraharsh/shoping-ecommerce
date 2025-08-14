'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function PageHero({
  title,
  eyebrow,
  description,
  image,
  overlay = 'from-black/50 via-black/20 to-black/60',
  align = 'left',
  ctas = [],
}) {
  const alignments = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  };

  return (
    <section className="relative h-[60vh] md:h-[70vh] lg:h-[75vh] w-full overflow-hidden">
      {image && (
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: 'translateZ(0)' }}
        />
      )}
      <div className={`absolute inset-0 bg-gradient-to-b ${overlay} z-10`}></div>
      <div className="absolute inset-0 z-20 flex">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex">
          <div className={`w-full self-center ${alignments[align]}`}>
            {eyebrow && (
              <div className="space-y-1 mb-4">
                <p className="text-white/80 text-xs sm:text-sm font-light tracking-[0.2em] uppercase">
                  {eyebrow}
                </p>
                <div className="w-12 h-px bg-white/30"></div>
              </div>
            )}
            <h1 className="heading-xl text-white leading-[0.95] tracking-[-0.02em] mb-4 sm:mb-6">
              {title}
            </h1>
            {description && (
              <p className="body-lg text-white/90 max-w-2xl mx-auto sm:mx-0 mb-6 sm:mb-8">
                {description}
              </p>
            )}
            {ctas?.length > 0 && (
              <div className={`flex flex-wrap gap-3 sm:gap-4 ${align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : ''}`}>
                {ctas.map((cta, i) => (
                  <Link
                    key={i}
                    href={cta.href || '#'}
                    className={`inline-flex items-center rounded-full min-h-[48px] px-6 sm:px-8 py-3 sm:py-4 font-semibold transition-colors duration-300 group
                      ${cta.variant === 'outline' ? 'btn-outline' : cta.variant === 'secondary' ? 'btn-secondary' : 'btn-primary'}`}
                  >
                    {cta.label}
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
