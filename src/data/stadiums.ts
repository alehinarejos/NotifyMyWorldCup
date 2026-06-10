export interface Stadium {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity: number;
}

export const STADIUMS: Stadium[] = [
  { id: "1", name: "Estadio Azteca", city: "Ciudad de México", country: "México", capacity: 87523 },
  { id: "2", name: "Estadio Akron", city: "Guadalajara", country: "México", capacity: 48070 },
  { id: "3", name: "Estadio BBVA", city: "Monterrey", country: "México", capacity: 53500 },
  { id: "4", name: "BC Place", city: "Vancouver", country: "Canadá", capacity: 54500 },
  { id: "5", name: "BMO Field", city: "Toronto", country: "Canadá", capacity: 45000 },
  { id: "6", name: "SoFi Stadium", city: "Los Ángeles", country: "Estados Unidos", capacity: 70240 },
  { id: "7", name: "MetLife Stadium", city: "Nueva York / Nueva Jersey", country: "Estados Unidos", capacity: 82500 },
  { id: "8", name: "Mercedes-Benz Stadium", city: "Atlanta", country: "Estados Unidos", capacity: 71000 },
  { id: "9", name: "Gillette Stadium", city: "Boston", country: "Estados Unidos", capacity: 65878 },
  { id: "10", name: "AT&T Stadium", city: "Dallas", country: "Estados Unidos", capacity: 80000 },
  { id: "11", name: "NRG Stadium", city: "Houston", country: "Estados Unidos", capacity: 72220 },
  { id: "12", name: "Arrowhead Stadium", city: "Kansas City", country: "Estados Unidos", capacity: 76416 },
  { id: "13", name: "Hard Rock Stadium", city: "Miami", country: "Estados Unidos", capacity: 64767 },
  { id: "14", name: "Lincoln Financial Field", city: "Filadelfia", country: "Estados Unidos", capacity: 69796 },
  { id: "15", name: "Lumen Field", city: "Seattle", country: "Estados Unidos", capacity: 69000 },
  { id: "16", name: "Levi's Stadium", city: "San Francisco", country: "Estados Unidos", capacity: 68500 }
];

export const getStadiumById = (id: string): Stadium | undefined => {
  return STADIUMS.find(s => s.id === id);
};
