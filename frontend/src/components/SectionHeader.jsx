export default function SectionHeader({ children, sub }) {
  return (
    <div className="mb-6">
      <h2 className="font-mono text-text-secondary text-sm mb-1">
        <span className="text-green-bright">// </span>{children}
      </h2>
      {sub && <p className="text-text-secondary text-xs">{sub}</p>}
      <div className="mt-2 h-px bg-border" />
    </div>
  )
}
