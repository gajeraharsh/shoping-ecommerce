export default function PaymentLogos() {
  const logos = [
    { src: '/payment/upi.svg', alt: 'UPI' },
    { src: '/payment/visa.svg', alt: 'Visa' },
    { src: '/payment/mastercard.svg', alt: 'Mastercard' },
    { src: '/payment/rupay.svg', alt: 'RuPay' },
    { src: '/payment/netbanking.svg', alt: 'NetBanking' },
    { src: '/payment/cod.svg', alt: 'Cash on Delivery' },
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
      {logos.map((l) => (
        <div key={l.alt} className="flex items-center justify-center rounded-lg bg-white border border-gray-200 dark:bg-gray-100 h-10 sm:h-12 p-1" aria-label={`Payment method ${l.alt}`}>
          {/* Using img over next/image for SVG simplicity and no layout shift */}
          <img src={l.src} alt={l.alt} className="h-6 sm:h-7 w-auto" loading="lazy" />
        </div>
      ))}
    </div>
  );
}
