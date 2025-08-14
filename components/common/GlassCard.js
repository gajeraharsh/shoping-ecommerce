export default function GlassCard({ as: Tag = 'div', className = '', children, hover = true, ...props }) {
  return (
    <Tag
      className={[
        'bg-white/70 dark:bg-gray-900/60 backdrop-blur-md border border-gray-200/60 dark:border-gray-800/60 rounded-2xl shadow-sm',
        hover ? 'hover:shadow-lg transition-shadow duration-300' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </Tag>
  );
}
