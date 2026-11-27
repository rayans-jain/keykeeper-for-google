import {
  BottleWine,
  Package,
  Smartphone,
  Recycle,
  ShieldCheck,
  ShieldAlert,
  ArrowDown,
} from "lucide-react";

export function RecyclingScene() {
  return (
    <div
      className="recycling-scene"
      role="img"
      aria-label="Animated sorting scene: reusable phone, recyclable bottle and cardboard, with separate hazardous waste collection"
    >
      <div className="scene-track" aria-hidden="true" />
      <div className="scene-scanner" aria-hidden="true">
        <div className="scene-scan-line" />
      </div>
      <div className="scene-object scene-phone" aria-hidden="true">
        <Smartphone />
        <span>KEEP</span>
      </div>
      <div className="scene-object scene-bottle" aria-hidden="true">
        <BottleWine />
        <span>RECYCLE</span>
      </div>
      <div className="scene-object scene-box" aria-hidden="true">
        <Package />
        <span>RECOVER</span>
      </div>
      <div className="scene-destinations" aria-hidden="true">
        <div>
          <ShieldCheck />
          <span>Useful</span>
          <ArrowDown />
        </div>
        <div>
          <Recycle className="scene-recycle-icon" />
          <span>Recyclable</span>
          <ArrowDown />
        </div>
        <div>
          <ShieldAlert />
          <span>Special care</span>
          <ArrowDown />
        </div>
      </div>
    </div>
  );
}
