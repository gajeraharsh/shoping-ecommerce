export default function SectionHeading({ title, subtitle, align = 'center' }) {
  const alignCls = align === 'left' ? 'items-start text-left' : align === 'right' ? 'items-end text-right' : 'items-center text-center';
  return (
    <div className={`flex flex-col ${alignCls} mb-12 sm:mb-16`}>
      <div className="space-y-2">
        <h2 className="heading-lg text-gray-900 dark:text-white">{title}</h2>
        {subtitle && <p className="body-lg text-fade max-w-2xl">{subtitle}</p>}
      </div>
      <div className={`mt-4 w-16 h-[2px] bg-gray-900/80 dark:bg-white/80 ${align === 'center' ? 'mx-auto' : ''}`}></div>
    </div>
  );
}
