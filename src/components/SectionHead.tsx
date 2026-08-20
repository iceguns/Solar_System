export default function SectionHead({
  index,
  en,
  title,
  note,
  dense = false,
}: {
  index: string;
  en: string;
  title: string;
  note: string;
  dense?: boolean;
}) {
  return (
    <div className={`reveal ${dense ? "mb-5" : "mb-10"} flex flex-wrap items-end justify-between gap-3`}>
      <div>
        <div className="flex items-center gap-3 font-numeric text-[11px] uppercase tracking-[0.3em] text-fog">
          <span className="text-solar">{index}</span>
          <span className="h-px w-10 bg-line" />
          <span>{en}</span>
        </div>
        <h2 className={`mt-2.5 font-display tracking-wide text-snow ${dense ? "text-2xl" : "text-3xl sm:text-4xl"}`}>
          {title}
        </h2>
      </div>
      {!dense && <p className="max-w-xs text-xs leading-relaxed text-fog">{note}</p>}
    </div>
  );
}
