import React from "react";
import { Popup } from "react-leaflet";

interface DetailRow {
  label: string;
  value: string | boolean;
}

interface MarkerPopupProps {
  title: string;
  subtitle?: string;
  details?: DetailRow[];
}

function BooleanBadge({ value }: { value: boolean }) {
  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold ${value ? "text-green-600" : "text-red-400"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${value ? "bg-green-500" : "bg-red-400"}`} />
      {value ? "✓" : "✗"}
    </span>
  );
}

export default function MarkerPopup({ title, subtitle, details }: MarkerPopupProps) {
  return (
    <Popup>
      <div className="max-w-52 overflow-hidden">
        <div className="px-3 py-1.5 text-center">
          <div className="font-semibold text-[11px] text-gray-900 leading-snug">{title}</div>
          {subtitle && (
            <div className="text-[10px] text-muted-foreground">{subtitle}</div>
          )}
        </div>
        {details && details.length > 0 && (
          <dl className="border-t border-gray-100 px-3 py-1.5 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5">
            {details.map(({ label, value }) => (
              <React.Fragment key={label}>
                <dt className="text-[10px] text-muted-foreground self-center">{label}</dt>
                <dd className="text-[11px] text-gray-800">
                  {typeof value === "boolean" ? <BooleanBadge value={value} /> : value}
                </dd>
              </React.Fragment>
            ))}
          </dl>
        )}
      </div>
    </Popup>
  );
}
