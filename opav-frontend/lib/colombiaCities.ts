// Coordenadas de ciudades principales de Colombia (ajustadas al viewBox 800x1000)
export const colombiaCities = {
  Bogotá: { lat: 4.711, lng: -74.0721, x: 420, y: 450 },
  Soacha: { lat: 4.5794, lng: -74.2169, x: 418, y: 465 },
  Medellín: { lat: 6.2476, lng: -75.5658, x: 360, y: 350 },
  Cali: { lat: 3.4516, lng: -76.532, x: 340, y: 550 },
  Barranquilla: { lat: 10.9639, lng: -74.7964, x: 400, y: 120 },
  Cartagena: { lat: 10.391, lng: -75.4794, x: 380, y: 140 },
  Bucaramanga: { lat: 7.1253, lng: -73.1198, x: 460, y: 320 },
  Pereira: { lat: 4.8133, lng: -75.6961, x: 350, y: 480 },
  "Santa Marta": { lat: 11.2408, lng: -74.199, x: 420, y: 100 },
  Cúcuta: { lat: 7.8939, lng: -72.5078, x: 500, y: 300 },
  Manizales: { lat: 5.07, lng: -75.5138, x: 355, y: 460 },
  Ibagué: { lat: 4.4389, lng: -75.2322, x: 370, y: 500 },
  Villavicencio: { lat: 4.142, lng: -73.6266, x: 480, y: 520 },
  Neiva: { lat: 2.9273, lng: -75.2819, x: 385, y: 580 },
  Armenia: { lat: 4.5339, lng: -75.6811, x: 348, y: 495 },
  Popayán: { lat: 2.4448, lng: -76.6147, x: 330, y: 600 },
  Pasto: { lat: 1.2136, lng: -77.2811, x: 310, y: 680 },
  Montería: { lat: 8.7479, lng: -75.8814, x: 365, y: 250 },
  Valledupar: { lat: 10.4631, lng: -73.2532, x: 445, y: 130 },
  Sincelejo: { lat: 9.3047, lng: -75.3978, x: 380, y: 200 },
  Tunja: { lat: 5.5353, lng: -73.3678, x: 455, y: 420 },
};

export type CityName = keyof typeof colombiaCities;

export interface CasoExitoLocation {
  id: number;
  nombre: string;
  ubicacion: string;
  empresa: "OPAV" | "B&S";
  slug: string;
  imagenPrincipal?: {
    url: string;
    alternativeText?: string;
  };
  area_construida?: number;
  ano_finalizacion?: number;
  descripcion?: string;
}

export interface GroupedCases {
  [city: string]: {
    opav: CasoExitoLocation[];
    bys: CasoExitoLocation[];
  };
}
