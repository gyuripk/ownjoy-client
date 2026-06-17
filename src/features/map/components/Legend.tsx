"use client";
import { useState } from "react";
import Image from "next/image";
import { X, Info, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLayerStore } from "@/store/useLayerStore";
import { LAYER_CATEGORIES } from "@/features/map/config/layersConfig";
import { CATEGORY_COLORS } from "@/components/SidePanel";

const GRADIENT_LAYER_IDS = new Set([
  "IF_0085_WMS",
  "IF_0083_WMS",
  "IF_0079_WMS",
  "IF_0078_WMS",
]);

const DARK_AREA_LAYER_IDS = new Set(["IF_0079_WMS", "IF_0078_WMS"]);

const LINE_LAYERS: Record<string, { color: string }> = {
  "safe-return-routes": { color: "#00c976" },
};

type LayerId = "IF_0085_WMS" | "IF_0083_WMS" | "IF_0079_WMS" | "IF_0078_WMS" | "cctv" | "smart-street-lights" | "emergency-bells" | "delivery-boxes" | "IF_0102_WMS" | "safe-return-routes" | "safe-stores" | "IF_0023_WMS" | "IF_0036_WMS" | "IF_0032_WMS";

export default function Legend({ align = "right" }: { align?: "left" | "right" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openInfoId, setOpenInfoId] = useState<string | null>(null);
  const [collapsedCats, setCollapsedCats] = useState<Set<string>>(new Set());
  const visibleLayers = useLayerStore((s) => s.visibleLayers);
  const t = useTranslations("legend");
  const tLayers = useTranslations("layers");
  const tCategories = useTranslations("categories");

  const activeCategories = LAYER_CATEGORIES
    .map((cat) => ({
      ...cat,
      activeLayers: cat.layers.filter((l) => visibleLayers.includes(l.id)),
    }))
    .filter((cat) => cat.activeLayers.length > 0);

  if (activeCategories.length === 0) return null;

  const toggleInfo = (id: string) =>
    setOpenInfoId((prev) => (prev === id ? null : id));

  const toggleCat = (id: string) =>
    setCollapsedCats((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });

  return (
    <div className="relative">
      {isOpen && (
        <div
          className={`absolute bottom-full mb-2 w-56 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden ${align === "right" ? "right-0" : "left-0"}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
            <span className="text-xs font-bold text-gray-800">{t("title")}</span>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X size={13} />
            </button>
          </div>

          {/* Categories */}
          <div className="flex flex-col divide-y divide-gray-100">
            {activeCategories.map((cat) => {
              const color = CATEGORY_COLORS[cat.id];
              const isCollapsed = collapsedCats.has(cat.id);

              return (
                <div key={cat.id} className="flex flex-col" style={{ backgroundColor: `${color}12` }}>
                  {/* Category header — clickable to collapse */}
                  <button
                    onClick={() => toggleCat(cat.id)}
                    className="flex items-center gap-1.5 px-3 py-2 w-full text-left"
                  >
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-xs font-bold flex-1" style={{ color }}>
                      {tCategories(cat.id)}
                    </span>
                    <ChevronDown
                      size={12}
                      className="shrink-0 text-gray-400 transition-transform duration-200"
                      style={{ transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)" }}
                    />
                  </button>

                  {/* Layers — hidden when collapsed */}
                  {!isCollapsed && (
                    <div className="flex flex-col gap-2.5 px-3 pb-2.5 pl-7">
                      {cat.activeLayers.map((layer) => {
                        const isInfoOpen = openInfoId === layer.id;

                        if (GRADIENT_LAYER_IDS.has(layer.id)) {
                          return (
                            <div key={layer.id} className="flex flex-col gap-1">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-gray-700">{tLayers(layer.id)}</span>
                                <button
                                  onClick={() => toggleInfo(layer.id)}
                                  className={`shrink-0 transition-colors rounded-full p-0.5 ${isInfoOpen ? "bg-gray-200 text-gray-600" : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600"}`}
                                >
                                  <Info size={12} />
                                </button>
                              </div>
                              <div
                                className="h-2.5 rounded-sm w-full"
                                style={{ background: "linear-gradient(to right, #fef08a, #ef4444)" }}
                              />
                              <div className="flex justify-between text-[10px] text-gray-400">
                                <span>{t("low")}</span>
                                <span>{t("high")}</span>
                              </div>
                              {DARK_AREA_LAYER_IDS.has(layer.id) && (
                                <div className="flex items-center gap-2 mt-0.5">
                                  <div
                                    className="w-8 h-2.5 rounded-sm shrink-0"
                                    style={{ backgroundColor: "rgba(120, 120, 120, 0.6)" }}
                                  />
                                  <span className="text-[10px] text-gray-500">{t("noSafetyLabel")}</span>
                                </div>
                              )}
                              {isInfoOpen && (
                                <div className="text-[10px] text-gray-500 bg-white bg-opacity-70 rounded-md px-2 py-1.5 leading-relaxed border border-gray-100 mt-0.5 whitespace-pre-line">
                                  {t(`layerInfo.${layer.id as LayerId}`)}
                                </div>
                              )}
                            </div>
                          );
                        }

                        const renderInlineVisual = () => {
                          if (LINE_LAYERS[layer.id]) {
                            return (
                              <div
                                className="h-1 w-6 rounded-full shrink-0"
                                style={{ backgroundColor: LINE_LAYERS[layer.id].color }}
                              />
                            );
                          }
                          if ("icon" in layer && typeof layer.icon === "string") {
                            return <Image src={layer.icon} alt="" width={14} height={14} className="shrink-0" />;
                          }
                          return null;
                        };

                        return (
                          <div key={layer.id} className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              {renderInlineVisual()}
                              <span className="text-xs font-semibold text-gray-700 flex-1">{tLayers(layer.id)}</span>
                              <button
                                onClick={() => toggleInfo(layer.id)}
                                className={`shrink-0 transition-colors rounded-full p-0.5 ${isInfoOpen ? "bg-gray-200 text-gray-600" : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600"}`}
                              >
                                <Info size={12} />
                              </button>
                            </div>
                            {isInfoOpen && (
                              <div className="text-[10px] text-gray-500 bg-white bg-opacity-70 rounded-md px-2 py-1.5 leading-relaxed border border-gray-100 whitespace-pre-line">
                                {t(`layerInfo.${layer.id as LayerId}`)}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center h-8 px-2.5 rounded-lg border border-gray-200 bg-white shadow-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
      >
        {t("title")}
      </button>
    </div>
  );
}
