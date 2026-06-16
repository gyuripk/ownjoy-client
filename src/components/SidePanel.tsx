"use client";
import { useState } from "react";
import { useLayerStore } from "@/store/useLayerStore";
import { LAYER_CATEGORIES } from "@/features/map/config/layersConfig";
import Image from "next/image";
import { useTranslations } from "next-intl";

export const CATEGORY_COLORS: Record<string, string> = {
  "crime-zone": "#dc2626",
  "crime-night": "#f97316",
  "security-infra": "#3b82f6",
  "security-service": "#10b981",
};

export default function SidePanel() {
  const visibleLayers = useLayerStore((state) => state.visibleLayers);
  const toggleLayer = useLayerStore((state) => state.toggleLayer);
  const selectExclusively = useLayerStore((state) => state.selectExclusively);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const tPanel = useTranslations("panel");
  const tCategories = useTranslations("categories");
  const tLayers = useTranslations("layers");

  const selectedCategory = LAYER_CATEGORIES.find((c) => c.id === selectedCategoryId);

  return (
    <>
      {/* Mobile */}
      <div className="md:hidden flex flex-col">
        {/* Active filters bar */}
        {visibleLayers.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 border-b overflow-x-auto bg-gray-50">
            <span className="text-xs text-gray-400 whitespace-nowrap">{tPanel("selected")}</span>
            {LAYER_CATEGORIES.flatMap((c) => c.layers)
              .filter((l) => visibleLayers.includes(l.id))
              .map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => toggleLayer(layer.id)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-800 text-white whitespace-nowrap"
                >
                  {tLayers(layer.id)} ×
                </button>
              ))}
          </div>
        )}

        {/* Category grid */}
        <div className="grid grid-cols-4 border-b">
          {LAYER_CATEGORIES.map((category) => {
            const isSelected = selectedCategoryId === category.id;
            const color = CATEGORY_COLORS[category.id];
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategoryId(isSelected ? null : category.id)}
                className="flex flex-col items-center justify-center gap-1 py-3 transition-all border-b-2 overflow-hidden min-w-0"
                style={{
                  borderBottomColor: isSelected ? color : "transparent",
                  backgroundColor: isSelected ? `${color}10` : "transparent",
                }}
              >
                {category.icon && <Image src={category.icon} alt="" width={32} height={32} />}
                <span
                  className="text-[10px] text-center leading-tight font-semibold w-full break-keep px-1"
                  style={{ color: isSelected ? color : "#6b7280" }}
                >
                  {tCategories(category.id)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sub-layer chips */}
        {selectedCategory && (
          <div className="flex flex-wrap gap-2 p-3 pb-4">
            {selectedCategory.layers.map((layer) => {
              const active = visibleLayers.includes(layer.id);
              const groupIds = selectedCategory.layers.map((l) => l.id);
              const color = CATEGORY_COLORS[selectedCategory.id];
              return (
                <button
                  key={layer.id}
                  onClick={() =>
                    selectedCategory.multiSelect
                      ? toggleLayer(layer.id)
                      : selectExclusively(layer.id, groupIds)
                  }
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs border transition-all"
                  style={
                    active
                      ? { backgroundColor: color, color: "white", borderColor: color }
                      : { backgroundColor: "white", color: "#4b5563", borderColor: "#d1d5db" }
                  }
                >
                  {"icon" in layer && layer.icon && (
                    <Image src={layer.icon} alt="" width={14} height={14} />
                  )}
                  {tLayers(layer.id)}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden md:block h-full">
        <div className="px-4 py-5 border-b">
          <h1 className="text-sm font-semibold text-gray-800">{tPanel("title")}</h1>
          <p className="text-[11px] text-gray-400 mt-0.5">{tPanel("subtitle")}</p>
        </div>

        {LAYER_CATEGORIES.map((category) => {
          const groupIds = category.layers.map((l) => l.id);
          const color = CATEGORY_COLORS[category.id];
          const activeCount = category.layers.filter((l) =>
            visibleLayers.includes(l.id)
          ).length;

          return (
            <div key={category.id} className="border-b last:border-0">
              {/* Category header */}
              <div
                className="flex items-center gap-2.5 px-4 pt-4 pb-2"
                style={{ borderLeft: `4px solid ${color}`, backgroundColor: `${color}0f` }}
              >
                {category.icon && (
                  <Image src={category.icon} alt="" width={22} height={22} />
                )}
                <h2 className="text-sm font-extrabold flex-1" style={{ color }}>
                  {tCategories(category.id)}
                </h2>
                {activeCount > 0 && (
                  <span
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: color }}
                  >
                    {activeCount}
                  </span>
                )}
              </div>

              {/* Layer chip buttons */}
              <div className="px-4 pt-3 pb-4 flex flex-wrap gap-2">
                {category.layers.map((layer) => {
                  const active = visibleLayers.includes(layer.id);
                  return (
                    <button
                      key={layer.id}
                      onClick={() =>
                        category.multiSelect
                          ? toggleLayer(layer.id)
                          : selectExclusively(layer.id, groupIds)
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 cursor-pointer"
                      style={
                        active
                          ? {
                              backgroundColor: color,
                              color: "white",
                              borderColor: color,
                              boxShadow: `0 2px 8px ${color}40`,
                            }
                          : {
                              backgroundColor: "white",
                              color: "#6b7280",
                              borderColor: "#e5e7eb",
                            }
                      }
                    >
                      {"icon" in layer && layer.icon && (
                        <Image
                          src={layer.icon}
                          alt=""
                          width={13}
                          height={13}
                          style={active ? { filter: "brightness(0) invert(1)" } : {}}
                        />
                      )}
                      {tLayers(layer.id)}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
