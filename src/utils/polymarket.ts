import type { PolymarketOdds } from "../data/matches";

// Diccionario de fuerza de los equipos para el simulador de cuotas (ratings realistas)
export const TEAM_RATINGS: Record<string, number> = {
  ARG: 92, FRA: 91, ESP: 90, ENG: 89, POR: 88, BRA: 88, GER: 86, NED: 85,
  BEL: 84, URU: 83, CRO: 82, COL: 81, MAR: 81, SUI: 80, USA: 79, JPN: 79,
  MEX: 78, SEN: 78, NOR: 78, TUR: 77, AUT: 77, ECU: 77, KOR: 76, CIV: 76,
  CZE: 76, CAN: 75, ALG: 75, GHA: 74, SCO: 74, PAR: 74, AUS: 74, TUN: 73,
  BIH: 73, IRN: 72, KSA: 71, CPV: 71, COD: 71, JOR: 71, UZB: 71, QAT: 70,
  IRQ: 70, PAN: 70, NZL: 65, HAI: 64, CUW: 62
};

// Mapeo de códigos de equipo a términos de búsqueda en inglés y español
export const TEAM_SEARCH_TERMS: Record<string, string[]> = {
  MEX: ["mexico", "méxico", "mex"],
  RSA: ["south africa", "sudafrica", "sudáfrica", "rsa"],
  KOR: ["south korea", "korea", "corea del sur", "corea", "kor"],
  CZE: ["czechia", "czech republic", "república checa", "republica checa", "cze"],
  CAN: ["canada", "canadá", "can"],
  BIH: ["bosnia", "herzegovina", "bosnia y herzegovina", "bih"],
  QAT: ["qatar", "catar", "qat"],
  SUI: ["switzerland", "suiza", "sui"],
  BRA: ["brazil", "brasil", "bra"],
  MAR: ["morocco", "marruecos", "mar"],
  HAI: ["haiti", "haití", "hai"],
  SCO: ["scotland", "escocia", "sco"],
  USA: ["usa", "united states", "estados unidos", "eeuu"],
  PAR: ["paraguay", "par"],
  AUS: ["australia", "aus"],
  TUR: ["turkey", "turkiye", "turquía", "turquia", "tur"],
  GER: ["germany", "alemania", "ger"],
  CUW: ["curacao", "curazao", "cuw"],
  CIV: ["ivory coast", "cote d'ivoire", "costa de marfil", "civ"],
  ECU: ["ecuador", "ecu"],
  NED: ["netherlands", "dutch", "países bajos", "paises bajos", "ned", "holanda"],
  JPN: ["japan", "japón", "japon", "jpn"],
  SWE: ["sweden", "suecia", "swe"],
  TUN: ["tunisia", "túnez", "tunez", "tun"],
  BEL: ["belgium", "bélgica", "belgica", "bel"],
  EGY: ["egypt", "egipto", "egy"],
  IRN: ["iran", "irán", "irn"],
  NZL: ["new zealand", "nueva zelanda", "nzl"],
  ESP: ["spain", "españa", "espana", "esp"],
  CPV: ["cape verde", "cabo verde", "cpv"],
  KSA: ["saudi arabia", "arabia saudita", "ksa", "arabia"],
  URU: ["uruguay", "uru"],
  FRA: ["france", "francia", "fra"],
  SEN: ["senegal", "sen"],
  IRQ: ["iraq", "irak", "irq"],
  NOR: ["norway", "noruega", "nor"],
  ARG: ["argentina", "arg"],
  ALG: ["algeria", "argelia", "alg"],
  AUT: ["austria", "aut"],
  JOR: ["jordan", "jordania", "jor"],
  POR: ["portugal", "por"],
  COD: ["congo", "dr congo", "rd congo", "cod"],
  UZB: ["uzbekistan", "uzbekistán", "uzb"],
  COL: ["colombia", "col"],
  ENG: ["england", "inglaterra", "eng"],
  CRO: ["croatia", "croacia", "cro"],
  GHA: ["ghana", "gha"],
  PAN: ["panama", "panamá", "pan"]
};

// Genera cuotas simuladas realistas basadas en el rating de fuerza
export const getSimulatedOdds = (homeTeamId: string, awayTeamId: string): PolymarketOdds => {
  const homeRating = TEAM_RATINGS[homeTeamId] || 75;
  const awayRating = TEAM_RATINGS[awayTeamId] || 75;
  
  // Añadimos una ligera ventaja de local si corresponde (no siempre es aplicable en mundial neutro, pero ayuda a la asimetría)
  const homeAdvantage = 1.5; 
  const diff = (homeRating + homeAdvantage) - awayRating;
  
  // Fórmulas realistas de probabilidades de fútbol
  let homeWin = Math.round(38 + diff * 1.5);
  let awayWin = Math.round(36 - diff * 1.5);
  
  // Limitar los extremos para evitar 100% o 0%
  homeWin = Math.max(15, Math.min(80, homeWin));
  awayWin = Math.max(15, Math.min(80, awayWin));
  
  const draw = 100 - homeWin - awayWin;
  
  return {
    homeWin,
    awayWin,
    draw,
    source: "simulated"
  };
};

// Función auxiliar para buscar coincidencia de un equipo en un texto
const matchTeamTerms = (text: string, teamId: string): boolean => {
  const terms = TEAM_SEARCH_TERMS[teamId];
  if (!terms) return false;
  const normalizedText = text.toLowerCase();
  return terms.some(term => normalizedText.includes(term));
};

// Obtiene la posición de la primera coincidencia de un término en un texto
const getFirstOccurrenceIndex = (text: string, teamId: string): number => {
  const terms = TEAM_SEARCH_TERMS[teamId];
  if (!terms) return Infinity;
  const normalizedText = text.toLowerCase();
  
  let minIndex = Infinity;
  terms.forEach(term => {
    const idx = normalizedText.indexOf(term);
    if (idx !== -1 && idx < minIndex) {
      minIndex = idx;
    }
  });
  return minIndex;
};

// Consulta la API de Polymarket para obtener los datos de mercados activos
export const fetchPolymarketOdds = async (
  matches: { id: string; homeTeamId: string; awayTeamId: string }[]
): Promise<Record<string, PolymarketOdds>> => {
  const oddsMap: Record<string, PolymarketOdds> = {};
  
  try {
    // 1. Fetch de los mercados de la copa mundial activos
    const response = await fetch("https://gamma-api.polymarket.com/public-search?q=World+Cup");
    if (!response.ok) {
      throw new Error(`Error en API de Polymarket: ${response.statusText}`);
    }
    
    const data = await response.json();
    const events = data.events || [];
    
    // Extraemos todos los mercados contenidos en los eventos
    const allMarkets: any[] = [];
    events.forEach((event: any) => {
      if (Array.isArray(event.markets)) {
        event.markets.forEach((market: any) => {
          allMarkets.push({
            ...market,
            eventTitle: event.title || "",
            eventSlug: event.slug || ""
          });
        });
      }
    });

    // 2. Intentar emparejar cada partido con algún mercado de Polymarket
    matches.forEach(match => {
      const { id: matchId, homeTeamId, awayTeamId } = match;
      
      // Intentamos buscar un mercado que hable de este enfrentamiento
      const matchedMarket = allMarkets.find(market => {
        const title = (market.question || "").toLowerCase();
        const slug = (market.slug || "").toLowerCase();
        
        // Debe mencionar a ambos equipos de alguna forma
        const homeMatched = matchTeamTerms(title, homeTeamId) || matchTeamTerms(slug, homeTeamId);
        const awayMatched = matchTeamTerms(title, awayTeamId) || matchTeamTerms(slug, awayTeamId);
        
        return homeMatched && awayMatched && market.active === true;
      });

      if (matchedMarket) {
        // Encontramos un mercado, parseamos los resultados
        let outcomes: string[] = [];
        let outcomePrices: string[] = [];
        
        try {
          outcomes = typeof matchedMarket.outcomes === "string" 
            ? JSON.parse(matchedMarket.outcomes) 
            : matchedMarket.outcomes;
          outcomePrices = typeof matchedMarket.outcomePrices === "string" 
            ? JSON.parse(matchedMarket.outcomePrices) 
            : matchedMarket.outcomePrices;
        } catch (e) {
          console.error(`Error parsing outcomes for match ${matchId}`, e);
        }

        if (outcomes.length > 0 && outcomePrices.length > 0) {
          const pricesNum = outcomePrices.map(p => parseFloat(p) || 0);
          const marketLink = matchedMarket.slug 
            ? `https://polymarket.com/market/${matchedMarket.slug}`
            : undefined;

          // Estructura 1: Mercado categórico con outcomes específicos (ej. [Local, Visitante, Empate])
          if (outcomes.length >= 3) {
            let homeWinIdx = outcomes.findIndex(o => matchTeamTerms(o, homeTeamId));
            let awayWinIdx = outcomes.findIndex(o => matchTeamTerms(o, awayTeamId));
            let drawIdx = outcomes.findIndex(o => {
              const name = o.toLowerCase();
              return name.includes("draw") || name.includes("tie") || name.includes("empate");
            });

            if (homeWinIdx !== -1 && awayWinIdx !== -1) {
              const homeWin = Math.round(pricesNum[homeWinIdx] * 100);
              const awayWin = Math.round(pricesNum[awayWinIdx] * 100);
              const draw = drawIdx !== -1 
                ? Math.round(pricesNum[drawIdx] * 100) 
                : Math.max(0, 100 - homeWin - awayWin);

              oddsMap[matchId] = {
                homeWin,
                awayWin,
                draw,
                source: "official",
                question: matchedMarket.question,
                link: marketLink
              };
              return;
            }
          }

          // Estructura 2: Mercado binario YES/NO (ej. "¿Ganará México a Sudáfrica?")
          if (outcomes.length === 2) {
            const yesPrice = pricesNum[0] * 100;
            const question = matchedMarket.question || "";
            
            // Determinamos quién es el sujeto principal del "YES"
            const homeIdx = getFirstOccurrenceIndex(question, homeTeamId);
            const awayIdx = getFirstOccurrenceIndex(question, awayTeamId);
            
            const homeIsSubject = homeIdx < awayIdx;
            const targetWin = Math.round(yesPrice);
            
            // Usamos las probabilidades simuladas para partir el "NO" de forma realista
            const simOdds = getSimulatedOdds(homeTeamId, awayTeamId);
            
            if (homeIsSubject) {
              const remaining = 100 - targetWin;
              const ratioAway = simOdds.awayWin / (simOdds.awayWin + simOdds.draw);
              const awayWin = Math.round(remaining * ratioAway);
              const draw = Math.max(0, remaining - awayWin);
              
              oddsMap[matchId] = {
                homeWin: targetWin,
                awayWin,
                draw,
                source: "official",
                question: matchedMarket.question,
                link: marketLink
              };
            } else {
              const remaining = 100 - targetWin;
              const ratioHome = simOdds.homeWin / (simOdds.homeWin + simOdds.draw);
              const homeWin = Math.round(remaining * ratioHome);
              const draw = Math.max(0, remaining - homeWin);
              
              oddsMap[matchId] = {
                homeWin,
                awayWin: targetWin,
                draw,
                source: "official",
                question: matchedMarket.question,
                link: marketLink
              };
            }
            return;
          }
        }
      }
      
      // Fallback: Generar cuotas simuladas si no se encontró mercado en Polymarket
      oddsMap[matchId] = getSimulatedOdds(homeTeamId, awayTeamId);
    });
    
  } catch (error) {
    console.error("No se pudieron obtener cuotas de Polymarket:", error);
    // Fallback general para todos los partidos
    matches.forEach(match => {
      oddsMap[match.id] = getSimulatedOdds(match.homeTeamId, match.awayTeamId);
    });
  }
  
  return oddsMap;
};
