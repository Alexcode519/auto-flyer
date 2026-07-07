// Scoped SA-market vehicle dataset: brand -> model -> [variants]
// "Other" is always injected at runtime so anything not listed can be typed manually.
const VEHICLE_DATA = {
  "Toyota": {
    "Land Cruiser 79 Series": ["4.5D LX V8 P/U S/C", "4.5D LX V8 P/U D/C", "4.2D P/U S/C"],
    "Land Cruiser 200/300": ["V8 VX", "V6 GX-R", "3.3D V6 GR-S"],
    "Hilux": ["2.8GD-6 Legend RS 4x4", "2.8GD-6 Raider 4x4", "2.4GD-6 SRX 4x4", "2.7 VVTi Raider"],
    "Fortuner": ["2.8GD-6 4x4 VX", "2.8GD-6 4x2 Legend", "2.4GD-6 4x2 Raised Body"],
    "Corolla": ["1.8 XS", "1.8 XR CVT", "Cross 1.8 XR"],
    "Hiace": ["2.5D-4D Bus", "2.8 GD-6 Bus"]
  },
  "Ford": {
    "Ranger": ["2.0 SiT Double Cab 4x4", "3.0 V6 Wildtrak 4x4", "2.2TDCi XL Single Cab"],
    "Everest": ["2.0 Bi-Turbo Sport 4x4", "3.0 V6 Platinum 4x4"],
    "Figo": ["1.5 Ambiente", "1.5 Trend"]
  },
  "Volkswagen": {
    "Amarok": ["2.0 BiTDI Highline 4Motion", "3.0 V6 Aventura 4Motion"],
    "Polo": ["1.0 TSI Comfortline", "GTI 2.0 TSI"],
    "Polo Vivo": ["1.4 Comfortline", "1.6 GT"]
  },
  "Nissan": {
    "Navara": ["2.5DDTI PRO-4X 4x4", "2.3D Double Cab LE 4x4"],
    "NP200": ["1.6i Pace"],
    "NP300 Hardbody": ["2.5 TDi Double Cab 4x4"]
  },
  "Isuzu": {
    "D-Max": ["3.0TD LX Double Cab 4x4", "3.0TD X-Rider 4x4"],
    "MU-X": ["3.0TD LSE 4x4"]
  },
  "Mahindra": {
    "Pik Up": ["2.2 mHawk S11 4x4 D/C", "S6 2.2 S/C"],
    "Scorpio": ["2.2 mHawk"]
  },
  "Hyundai": {
    "Creta": ["1.5 Executive"],
    "H100 Bakkie": ["2.6D Chassis Cab"]
  },
  "Kia": {
    "Sportage": ["2.0 Ignite"],
    "K2700": ["Workhorse"]
  },
  "Suzuki": {
    "Jimny": ["1.5 GLX 4x4"],
    "Ertiga": ["1.5 GLX"]
  },
  "Mercedes-Benz": {
    "X-Class": ["X350d Power 4Matic"],
    "Sprinter": ["Panel Van 2.2 CDI"]
  },
  "GWM / Haval": {
    "P-Series": ["2.0TD LT 4x4 Double Cab"],
    "Haval H6": ["2.0T Luxury"]
  },
  "Mazda": {
    "BT-50": ["3.0 Boss 4x4 Double Cab"],
    "CX-5": ["2.0 Active"]
  },
  "Mitsubishi": {
    "Triton": ["2.4Di-D Double Cab 4x4"],
    "Pajero Sport": ["2.4Di-D 4x4"]
  }
};
