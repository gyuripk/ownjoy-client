"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMapStore } from "@/store/useMapStore";

type JusoAddress = {
  roadAddr: string;
  jibunAddr: string;
  engAddr: string;
  bdNm: string;
  admCd: string;
  rnMgtSn: string;
  udrtYn: string;
  buldMnnm: number;
  buldSlno: number;
  _lat?: string;
  _lng?: string;
};

function getDisplayName(address: JusoAddress, locale: string) {
  if (locale === "en") {
    return { name: address.engAddr || address.roadAddr, sub: address.bdNm || "" };
  }
  const name = address.bdNm || address.roadAddr;
  const sub = address.bdNm ? address.roadAddr : address.jibunAddr;
  return { name, sub };
}

export default function SearchBar() {
  const flyTo = useMapStore((s) => s.flyTo);
  const setSelectedPlace = useMapStore((s) => s.setSelectedPlace);
  const t = useTranslations("search");
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<JusoAddress[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [noResults, setNoResults] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchResults = async (value: string): Promise<JusoAddress[]> => {
    const res = await fetch(
      `/api/geocode?q=${encodeURIComponent(value.trim())}&lang=${locale}`
    );
    return res.json();
  };

  const handleChange = (value: string) => {
    setQuery(value);
    setHighlightedIndex(-1);
    setNoResults(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setResults([]);
      setSelectedPlace(null);
      return;
    }

    const delay = locale === "en" ? 300 : 250;
    debounceRef.current = setTimeout(async () => {
      const data = await fetchResults(value);
      setResults(data);
      // Don't show "no results" during typing — only on explicit search
    }, delay);
  };

  const handleSelect = async (address: JusoAddress) => {
    const { name } = getDisplayName(address, locale);
    setQuery(name);
    setResults([]);
    setNoResults(false);
    setHighlightedIndex(-1);

    if (address._lat && address._lng) {
      const lat = parseFloat(address._lat);
      const lng = parseFloat(address._lng);
      setSelectedPlace({ lat, lng });
      flyTo?.(lat, lng);
      return;
    }

    const params = new URLSearchParams({
      admCd: address.admCd,
      rnMgtSn: address.rnMgtSn,
      udrtYn: address.udrtYn,
      buldMnnm: String(address.buldMnnm),
      buldSlno: String(address.buldSlno),
      q: address.roadAddr,
    });

    const res = await fetch(`/api/geocode/coord?${params}`);
    const body = await res.json();
    if (!res.ok) return;
    const { lat, lng } = body;
    setSelectedPlace({ lat, lng });
    flyTo?.(lat, lng);
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    const target = highlightedIndex >= 0 ? results[highlightedIndex] : results[0];
    if (target) {
      handleSelect(target);
      return;
    }
    const data = await fetchResults(query);
    setResults(data);
    setNoResults(data.length === 0);
    if (data[0]) handleSelect(data[0]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    } else if (e.key === "Escape") {
      setResults([]);
      setNoResults(false);
      setHighlightedIndex(-1);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setNoResults(false);
    setHighlightedIndex(-1);
    setSelectedPlace(null);
  };

  const showDropdown = results.length > 0 || noResults;

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="text"
          lang={locale}
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("placeholder")}
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-3 pr-16 text-sm shadow-lg outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
        />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query && (
            <button onClick={handleClear} className="text-gray-400 hover:text-gray-600 p-0.5">
              <X size={14} />
            </button>
          )}
          <button
            onClick={handleSearch}
            className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-rose-50 transition-colors"
            aria-label={t("placeholder")}
          >
            <Image src="/icon-search.png" alt="" width={18} height={18} />
          </button>
        </div>
      </div>

      {showDropdown && (
        <ul className="mt-1 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
          {results.length > 0 ? (
            results.map((r, i) => {
              const { name, sub } = getDisplayName(r, locale);
              return (
                <li key={i}>
                  <button
                    onClick={() => handleSelect(r)}
                    onMouseEnter={() => setHighlightedIndex(i)}
                    onMouseLeave={() => setHighlightedIndex(-1)}
                    className={`flex items-start gap-2.5 w-full px-3 py-2.5 text-left border-b border-gray-50 last:border-0 transition-colors ${
                      highlightedIndex === i ? "bg-rose-50" : "hover:bg-rose-50"
                    }`}
                  >
                    <Image
                      src="/icon-search.png"
                      alt=""
                      width={13}
                      height={13}
                      className="mt-0.5 shrink-0 opacity-40"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800">{name}</p>
                      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
                    </div>
                  </button>
                </li>
              );
            })
          ) : (
            <li className="px-4 py-3 text-sm text-gray-400 text-center">
              {t("noResults")}
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
