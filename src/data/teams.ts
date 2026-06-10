export interface Team {
  id: string;
  name: string;
  code: string; // FIFA code
  iso: string;  // ISO 2-letter code for FlagCDN
  group: string; // A - L
  flagUrl: string;
}

export const TEAMS: Team[] = [
  // Group A
  { id: "MEX", name: "México", code: "MEX", iso: "mx", group: "A", flagUrl: "https://flagcdn.com/w80/mx.png" },
  { id: "RSA", name: "Sudáfrica", code: "RSA", iso: "za", group: "A", flagUrl: "https://flagcdn.com/w80/za.png" },
  { id: "KOR", name: "Corea del Sur", code: "KOR", iso: "kr", group: "A", flagUrl: "https://flagcdn.com/w80/kr.png" },
  { id: "CZE", name: "República Checa", code: "CZE", iso: "cz", group: "A", flagUrl: "https://flagcdn.com/w80/cz.png" },

  // Group B
  { id: "CAN", name: "Canadá", code: "CAN", iso: "ca", group: "B", flagUrl: "https://flagcdn.com/w80/ca.png" },
  { id: "BIH", name: "Bosnia y Herzegovina", code: "BIH", iso: "ba", group: "B", flagUrl: "https://flagcdn.com/w80/ba.png" },
  { id: "QAT", name: "Catar", code: "QAT", iso: "qa", group: "B", flagUrl: "https://flagcdn.com/w80/qa.png" },
  { id: "SUI", name: "Suiza", code: "SUI", iso: "ch", group: "B", flagUrl: "https://flagcdn.com/w80/ch.png" },

  // Group C
  { id: "BRA", name: "Brasil", code: "BRA", iso: "br", group: "C", flagUrl: "https://flagcdn.com/w80/br.png" },
  { id: "MAR", name: "Marruecos", code: "MAR", iso: "ma", group: "C", flagUrl: "https://flagcdn.com/w80/ma.png" },
  { id: "HAI", name: "Haití", code: "HAI", iso: "ht", group: "C", flagUrl: "https://flagcdn.com/w80/ht.png" },
  { id: "SCO", name: "Escocia", code: "SCO", iso: "gb-sct", group: "C", flagUrl: "https://flagcdn.com/w80/gb-sct.png" },

  // Group D
  { id: "USA", name: "Estados Unidos", code: "USA", iso: "us", group: "D", flagUrl: "https://flagcdn.com/w80/us.png" },
  { id: "PAR", name: "Paraguay", code: "PAR", iso: "py", group: "D", flagUrl: "https://flagcdn.com/w80/py.png" },
  { id: "AUS", name: "Australia", code: "AUS", iso: "au", group: "D", flagUrl: "https://flagcdn.com/w80/au.png" },
  { id: "TUR", name: "Turquía", code: "TUR", iso: "tr", group: "D", flagUrl: "https://flagcdn.com/w80/tr.png" },

  // Group E
  { id: "GER", name: "Alemania", code: "GER", iso: "de", group: "E", flagUrl: "https://flagcdn.com/w80/de.png" },
  { id: "CUW", name: "Curazao", code: "CUW", iso: "cw", group: "E", flagUrl: "https://flagcdn.com/w80/cw.png" },
  { id: "CIV", name: "Costa de Marfil", code: "CIV", iso: "ci", group: "E", flagUrl: "https://flagcdn.com/w80/ci.png" },
  { id: "ECU", name: "Ecuador", code: "ECU", iso: "ec", group: "E", flagUrl: "https://flagcdn.com/w80/ec.png" },

  // Group F
  { id: "NED", name: "Países Bajos", code: "NED", iso: "nl", group: "F", flagUrl: "https://flagcdn.com/w80/nl.png" },
  { id: "JPN", name: "Japón", code: "JPN", iso: "jp", group: "F", flagUrl: "https://flagcdn.com/w80/jp.png" },
  { id: "SWE", name: "Suecia", code: "SWE", iso: "se", group: "F", flagUrl: "https://flagcdn.com/w80/se.png" },
  { id: "TUN", name: "Túnez", code: "TUN", iso: "tn", group: "F", flagUrl: "https://flagcdn.com/w80/tn.png" },

  // Group G
  { id: "BEL", name: "Bélgica", code: "BEL", iso: "be", group: "G", flagUrl: "https://flagcdn.com/w80/be.png" },
  { id: "EGY", name: "Egipto", code: "EGY", iso: "eg", group: "G", flagUrl: "https://flagcdn.com/w80/eg.png" },
  { id: "IRN", name: "Irán", code: "IRN", iso: "ir", group: "G", flagUrl: "https://flagcdn.com/w80/ir.png" },
  { id: "NZL", name: "Nueva Zelanda", code: "NZL", iso: "nz", group: "G", flagUrl: "https://flagcdn.com/w80/nz.png" },

  // Group H
  { id: "ESP", name: "España", code: "ESP", iso: "es", group: "H", flagUrl: "https://flagcdn.com/w80/es.png" },
  { id: "CPV", name: "Cabo Verde", code: "CPV", iso: "cv", group: "H", flagUrl: "https://flagcdn.com/w80/cv.png" },
  { id: "KSA", name: "Arabia Saudita", code: "KSA", iso: "sa", group: "H", flagUrl: "https://flagcdn.com/w80/sa.png" },
  { id: "URU", name: "Uruguay", code: "URU", iso: "uy", group: "H", flagUrl: "https://flagcdn.com/w80/uy.png" },

  // Group I
  { id: "FRA", name: "Francia", code: "FRA", iso: "fr", group: "I", flagUrl: "https://flagcdn.com/w80/fr.png" },
  { id: "SEN", name: "Senegal", code: "SEN", iso: "sn", group: "I", flagUrl: "https://flagcdn.com/w80/sn.png" },
  { id: "IRQ", name: "Irak", code: "IRQ", iso: "iq", group: "I", flagUrl: "https://flagcdn.com/w80/iq.png" },
  { id: "NOR", name: "Noruega", code: "NOR", iso: "no", group: "I", flagUrl: "https://flagcdn.com/w80/no.png" },

  // Group J
  { id: "ARG", name: "Argentina", code: "ARG", iso: "ar", group: "J", flagUrl: "https://flagcdn.com/w80/ar.png" },
  { id: "ALG", name: "Argelia", code: "ALG", iso: "dz", group: "J", flagUrl: "https://flagcdn.com/w80/dz.png" },
  { id: "AUT", name: "Austria", code: "AUT", iso: "at", group: "J", flagUrl: "https://flagcdn.com/w80/at.png" },
  { id: "JOR", name: "Jordania", code: "JOR", iso: "jo", group: "J", flagUrl: "https://flagcdn.com/w80/jo.png" },

  // Group K
  { id: "POR", name: "Portugal", code: "POR", iso: "pt", group: "K", flagUrl: "https://flagcdn.com/w80/pt.png" },
  { id: "COD", name: "R.D. Congo", code: "COD", iso: "cd", group: "K", flagUrl: "https://flagcdn.com/w80/cd.png" },
  { id: "UZB", name: "Uzbekistán", code: "UZB", iso: "uz", group: "K", flagUrl: "https://flagcdn.com/w80/uz.png" },
  { id: "COL", name: "Colombia", code: "COL", iso: "co", group: "K", flagUrl: "https://flagcdn.com/w80/co.png" },

  // Group L
  { id: "ENG", name: "Inglaterra", code: "ENG", iso: "gb-eng", group: "L", flagUrl: "https://flagcdn.com/w80/gb-eng.png" },
  { id: "CRO", name: "Croacia", code: "CRO", iso: "hr", group: "L", flagUrl: "https://flagcdn.com/w80/hr.png" },
  { id: "GHA", name: "Ghana", code: "GHA", iso: "gh", group: "L", flagUrl: "https://flagcdn.com/w80/gh.png" },
  { id: "PAN", name: "Panamá", code: "PAN", iso: "pa", group: "L", flagUrl: "https://flagcdn.com/w80/pa.png" },
];

export const getTeamById = (id: string): Team | undefined => {
  return TEAMS.find(t => t.id === id);
};
