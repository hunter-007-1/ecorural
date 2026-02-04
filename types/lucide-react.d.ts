declare module 'lucide-react' {
  import { FC, SVGProps } from 'react';

  interface IconProps extends SVGProps<SVGSVGElement> {
    size?: number;
    strokeWidth?: number;
    absoluteStrokeWidth?: boolean;
  }

  type Icon = FC<IconProps>;

  export const Play: Icon;
  export const Pause: Icon;
  export const MapPin: Icon;
  export const Clock: Icon;
  export const Leaf: Icon;
  export const Footprints: Icon;
  export const Bike: Icon;
  export const Bus: Icon;
  export const Home: Icon;
  export const TreeDeciduous: Icon;
  export const Navigation: Icon;
  export const TreePine: Icon;
  export const Activity: Icon;
  export const ShoppingBag: Icon;
  export const User: Icon;
  export const Coins: Icon;
  export const Flame: Icon;
  export const Award: Icon;
  export const Package: Icon;
  export const Truck: Icon;
  export const History: Icon;
  export const Calendar: Icon;
  export const ArrowLeft: Icon;
  export const ArrowRight: Icon;
  export const Check: Icon;
  export const Sprout: Icon;
  export const Sun: Icon;
  export const CloudRain: Icon;
  export const Mountain: Icon;
  export const ShieldCheck: Icon;
  export const Trophy: Icon;
  export const Star: Icon;
  export const Zap: Icon;
}
