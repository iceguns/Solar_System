export default function SectionHead({
  index,
  en,
  title,
  note,
}: {
  index: string;
  en: string;
  title: string;
  note: string;
}) {
  return (
    <div className="reveal mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 font-numeric text-[11px] uppercase tracking-[0.3em] text-fog">
          <span className="text-solar">{index}</span>
          <span className="h-px w-10 bg-line" />
          <span>{en}</span>
        </div>
        <h2 className="mt-3 font-display text-3xl tracking-wide text-snow sm:text-4xl">{title}</h2>
      </div>
      <p className="max-w-xs text-xs leading-relaxed text-fog">{note}</p>
    </div>
  );
}
