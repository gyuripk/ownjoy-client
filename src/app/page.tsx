"use client";
import { useState } from "react";
import Image from "next/image";
import { PanelLeftClose, PanelLeftOpen, SlidersHorizontal, ChevronUp } from "lucide-react";
import Header from "@/components/Header";
import SidePanel from "@/components/SidePanel";
import { LAYER_CATEGORIES } from "@/features/map/config/layersConfig";
import { CATEGORY_COLORS } from "@/components/SidePanel";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../features/map/components/Map"), {
  ssr: false,
  loading: () => <div>Loading the map..</div>,
});

export default function Home() {
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      <Header />

      <main className="flex-1 relative">
        <Map />

        {/* Desktop: floating left panel */}
        <div
          className={`hidden md:flex flex-col absolute top-0 left-0 bottom-0 z-999 bg-white overflow-hidden transition-all duration-300 ${isPanelOpen ? "w-72" : "w-12"}`}
          style={{ boxShadow: "2px 0 16px 0 rgba(0,0,0,0.10)" }}
        >
          {isPanelOpen ? (
            <div className="overflow-y-auto flex-1 min-w-72">
              <SidePanel />
            </div>
          ) : (
            /* Collapsed icon strip */
            <div className="flex flex-col items-center pt-4 gap-3 w-12">
              {LAYER_CATEGORIES.map((cat) => {
                const color = CATEGORY_COLORS[cat.id];
                return (
                  <button
                    key={cat.id}
                    onClick={() => setIsPanelOpen(true)}
                    title={cat.name}
                    className="flex items-center justify-center w-9 h-9 rounded-full transition-opacity hover:opacity-80"
                    style={{
                      backgroundColor: `${color}20`,
                      border: `2px solid ${color}50`,
                      boxShadow: `0 2px 8px ${color}30`,
                    }}
                  >
                    {cat.icon && (
                      <Image src={cat.icon} alt={cat.name} width={22} height={22} />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Desktop: toggle button */}
        <button
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          className="hidden md:flex absolute top-1/2 -translate-y-1/2 z-999 items-center justify-center w-9 h-9 rounded-full bg-white border border-gray-200 shadow-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-xl text-gray-500 hover:text-gray-800"
          style={{ left: isPanelOpen ? "calc(18rem - 1.125rem)" : "calc(3rem - 1.125rem)" }}
          aria-label={isPanelOpen ? "패널 닫기" : "패널 열기"}
        >
          {isPanelOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
        </button>
      </main>

      {/* Mobile: bottom drawer */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-1001 transition-transform duration-300"
        style={{
          maxHeight: "72vh",
          transform: isMobileDrawerOpen ? "translateY(0)" : "translateY(calc(100% - 5rem))",
        }}
      >
        {/* Handle bar — always visible as peek */}
        <div
          className="flex items-center gap-3 px-5 h-20 cursor-pointer border-b border-gray-100"
          onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
        >
          <div className="flex justify-center w-full absolute top-3 left-0">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>
          <SlidersHorizontal size={17} className="text-gray-400 mt-2" />
          <div className="flex-1 mt-2">
            <p className="text-sm font-bold text-gray-800 leading-tight">레이어 필터</p>
            <p className="text-xs text-gray-400 mt-0.5">지도에 표시할 정보를 선택하세요</p>
          </div>
          <ChevronUp
            size={18}
            className={`text-gray-400 mt-2 transition-transform duration-300 ${isMobileDrawerOpen ? "" : "rotate-180"}`}
          />
        </div>
        {/* Scrollable content */}
        <div className="overflow-y-auto pb-2" style={{ maxHeight: "calc(72vh - 5rem)" }}>
          <SidePanel />
        </div>
      </div>
    </div>
  );
}
