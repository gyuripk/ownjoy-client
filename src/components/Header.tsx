import Image from "next/image";

export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-5 z-[1000] shadow-sm flex-shrink-0">
      <div className="flex items-center gap-3">
        <Image
          src="/icon-handshake.png"
          alt="logo"
          width={42}
          height={42}
          style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.18))" }}
        />
        <div>
          <span className="text-base font-extrabold text-gray-900">여성 안심지도</span>
          <p className="text-xs text-gray-400">전국 여성 안전 정보 지도</p>
        </div>
      </div>
      <button className="text-sm text-gray-500 border border-gray-300 px-3 py-1 rounded hover:bg-gray-50">
        KO | EN
      </button>
    </header>
  );
}
