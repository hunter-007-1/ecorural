"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { Home, TreeDeciduous, Navigation } from "lucide-react";
import "leaflet/dist/leaflet.css";

const iconMapping = {
 驿站: {
    icon: Home,
    color: "#22c55e",
    label: "驿站",
  },
 打卡点: {
    icon: TreeDeciduous,
    color: "#16a34a",
    label: "打卡点",
  },
};

const createCustomIcon = (type: "驿站" | "打卡点") => {
  const config = iconMapping[type];
  const Icon = config.icon;

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
      ">
        <div style="
          width: 36px;
          height: 36px;
          background: ${config.color};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          border: 2px solid white;
        ">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="${getIconPath(config.icon.name)}"/>
          </svg>
        </div>
        <span style="
          background: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: bold;
          margin-top: 4px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        ">${config.label}</span>
      </div>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50],
  });
};

function getIconPath(iconName: string): string {
  const paths: Record<string, string> = {
    Home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
    TreeDeciduous: "M12 2L8 8H3L7 14H4L8 22L12 16L16 22L20 14H17L21 8H16L12 2Z",
  };
  return paths[iconName] || "";
}

interface VillagePoint {
  id: string;
  name: string;
  position: [number, number];
  type: "驿站" | "打卡点";
  description: string;
  extraInfo?: string;
}

const mockVillages: VillagePoint[] = [
  {
    id: "p1",
    name: "平谷镇罗营镇",
    position: [40.25, 117.05],
    type: "驿站",
    description: "平谷区乡健驿站",
    extraInfo: "可兑换农产品库存：50件",
  },
  {
    id: "p2",
    name: "金海湖镇",
    position: [40.15, 117.15],
    type: "驿站",
    description: "金海湖乡健驿站",
    extraInfo: "可兑换农产品库存：35件",
  },
  {
    id: "p3",
    name: "密云司马台",
    position: [40.55, 117.25],
    type: "驿站",
    description: "密云区乡健驿站",
    extraInfo: "可兑换农产品库存：42件",
  },
  {
    id: "c1",
    name: "古树认养点",
    position: [40.20, 117.10],
    type: "打卡点",
    description: "千年古树认养点",
  },
  {
    id: "c2",
    name: "生态林打卡",
    position: [40.50, 117.20],
    type: "打卡点",
    description: "生态林认养打卡点",
  },
  {
    id: "c3",
    name: "水库观鸟点",
    position: [40.30, 117.30],
    type: "打卡点",
    description: "水库观鸟打卡点",
  },
];

const cyclingRoute: [number, number][] = [
  [40.20, 117.05],
  [40.22, 117.08],
  [40.25, 117.10],
  [40.28, 117.12],
  [40.30, 117.15],
  [40.32, 117.18],
  [40.35, 117.20],
  [40.38, 117.22],
  [40.40, 117.25],
];

const routeInfo = {
  distance: 15,
  calories: 600,
  points: 200,
};

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 12);
  }, [center, map]);
  return null;
}

interface EcoMapProps {
  onArrive?: (village: VillagePoint) => void;
}

export default function EcoMap({ onArrive }: EcoMapProps) {
  const [showArriveModal, setShowArriveModal] = useState(false);
  const [arrivedVillage, setArrivedVillage] = useState<VillagePoint | null>(null);
  const [selectedRouteInfo, setSelectedRouteInfo] = useState(false);

  const handleSimulateArrive = () => {
    const targetVillage = mockVillages.find((v) => v.type === "驿站");
    if (targetVillage) {
      setArrivedVillage(targetVillage);
      setShowArriveModal(true);
      onArrive?.(targetVillage);
    }
  };

  const handleCheckIn = () => {
    setShowArriveModal(false);
    alert(`打卡成功！获得 50 积分`);
  };

  const center: [number, number] = [40.30, 117.15];

  return (
    <>
      <MapContainer
        center={center}
        zoom={11}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController center={center} />

        {mockVillages.map((village) => (
          <Marker
            key={village.id}
            position={village.position}
            icon={createCustomIcon(village.type)}
          >
            <Popup>
              <div className="p-2 min-w-[180px]">
                <h3 className="font-bold text-green-700 text-sm mb-1">
                  {village.description}
                </h3>
                <p className="text-xs text-gray-600 mb-2">{village.name}</p>
                {village.type === "驿站" && village.extraInfo && (
                  <p className="text-xs text-green-600 font-medium bg-green-50 p-1.5 rounded">
                    {village.extraInfo}
                  </p>
                )}
                {village.type === "打卡点" && (
                  <p className="text-xs text-blue-600 font-medium bg-blue-50 p-1.5 rounded">
                    打卡获得 50 积分
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        <Polyline
          positions={cyclingRoute}
          pathOptions={{
            color: "#22c55e",
            weight: 4,
            opacity: 0.8,
            dashArray: "10, 10",
          }}
          eventHandlers={{
            click: () => setSelectedRouteInfo(true),
          }}
        />
      </MapContainer>

      {showArriveModal && arrivedVillage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Navigation className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                您已到达 {arrivedVillage.name}
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                是否进行低碳打卡？
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowArriveModal(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium"
                >
                  取消
                </button>
                <button
                  onClick={handleCheckIn}
                  className="flex-1 py-3 px-4 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700"
                >
                  确认打卡
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedRouteInfo && (
        <div
          className="fixed inset-0 bg-black/30 flex items-end justify-center z-[999] p-4"
          onClick={() => setSelectedRouteInfo(false)}
        >
          <div
            className="bg-white rounded-t-3xl p-6 max-w-md w-full animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-4">
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900">
                低碳骑行示范线
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">全程距离</span>
                <span className="font-medium">{routeInfo.distance} km</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">预计消耗</span>
                <span className="font-medium">{routeInfo.calories} kcal</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">奖励积分</span>
                <span className="font-bold text-green-600">
                  +{routeInfo.points}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedRouteInfo(false)}
              className="w-full mt-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleSimulateArrive}
        className="fixed bottom-24 right-4 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium z-[500] hover:bg-green-700 transition-colors flex items-center gap-2"
      >
        <Navigation className="w-4 h-4" />
        模拟到达
      </button>
    </>
  );
}
