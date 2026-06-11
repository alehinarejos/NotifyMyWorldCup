import { useState, useEffect, useCallback } from "react";
import { Bell, BellOff, HelpCircle } from "lucide-react";
import { MATCHES, getMatchesWithDetails } from "./data/matches";
import type { Match, MatchWithDetails } from "./data/matches";
import { getTeamById } from "./data/teams";
import { STADIUMS } from "./data/stadiums";
import { MatchCard } from "./components/MatchCard";
import { MatchFilters } from "./components/MatchFilters";
import { GroupStandings } from "./components/GroupStandings";
import { CalendarModal } from "./components/CalendarModal";
import { SimulatorControl } from "./components/SimulatorControl";
import { useNotifications } from "./hooks/useNotifications";
import { WC26Logo } from "./components/WC26Logo";
import { fetchPolymarketOdds, getSimulatedOdds } from "./utils/polymarket";

// Goleadores realistas de selecciones para el simulador
const POPULAR_SCORERS: Record<string, string[]> = {
  MEX: ["Santiago Giménez", "Hirving Lozano", "Edson Álvarez", "Luis Chávez", "Raúl Jiménez", "Orbelín Pineda"],
  RSA: ["Percy Tau", "Themba Zwane", "Teboho Mokoena", "Evidence Makgopa", "Mihlali Mayambela"],
  KOR: ["Son Heung-min", "Hwang Hee-chan", "Lee Kang-in", "Cho Gue-sung", "Kim Min-jae"],
  CZE: ["Patrik Schick", "Tomáš Souček", "Adam Hložek", "Václav Černý", "Jan Kuchta"],
  CAN: ["Jonathan David", "Alphonso Davies", "Cyle Larin", "Tajon Buchanan", "Stephen Eustáquio"],
  BIH: ["Edin Džeko", "Ermedin Demirović", "Miralem Pjanić", "Luka Menalo", "Amar Dedić"],
  QAT: ["Akram Afif", "Almoez Ali", "Hassan Al-Haydos", "Mohammed Muntari"],
  SUI: ["Breel Embolo", "Xherdan Shaqiri", "Zeki Amdouni", "Ruben Vargas", "Granit Xhaka"],
  BRA: ["Vinícius Júnior", "Rodrygo", "Endrick", "Lucas Paquetá", "Gabriel Martinelli", "Raphinha"],
  MAR: ["Youssef En-Nesyri", "Hakim Ziyech", "Achraf Hakimi", "Amine Harit", "Sofiane Boufal"],
  HAI: ["Frantzdy Pierrot", "Duckens Nazon", "Louicius Don Deedson", "Carnejy Antoine"],
  SCO: ["Scott McTominay", "John McGinn", "Che Adams", "Lyndon Dykes", "Ryan Christie"],
  USA: ["Christian Pulisic", "Folarin Balogun", "Timothy Weah", "Weston McKennie", "Ricardo Pepi", "Brenden Aaronson"],
  PAR: ["Miguel Almirón", "Julio Enciso", "Antonio Sanabria", "Ramón Sosa", "Gustavo Gómez"],
  AUS: ["Mitchell Duke", "Craig Goodwin", "Jackson Irvine", "Harry Souttar"],
  TUR: ["Arda Güler", "Hakan Çalhanoğlu", "Kenan Yıldız", "Barış Alper Yılmaz", "Kerem Aktürkoğlu"],
  GER: ["Jamal Musiala", "Florian Wirtz", "Kai Havertz", "Niclas Füllkrug", "Leroy Sané", "Serge Gnabry"],
  CUW: ["Juninho Bacuna", "Leandro Bacuna", "Kenji Gorré", "Rangelo Janga"],
  CIV: ["Sébastien Haller", "Franck Kessié", "Simon Adingra", "Seko Fofana", "Nicolas Pépé"],
  ECU: ["Enner Valencia", "Kendry Páez", "Jordi Caicedo", "Ángel Mena"],
  NED: ["Memphis Depay", "Cody Gakpo", "Wout Weghorst", "Xavi Simons", "Donyell Malen"],
  JPN: ["Kaoru Mitoma", "Ayase Ueda", "Ritsu Doan", "Takefusa Kubo", "Takumi Minamino"],
  SWE: ["Alexander Isak", "Viktor Gyökeres", "Dejan Kulusevski", "Emil Forsberg"],
  TUN: ["Youssef Msakni", "Montassar Talbi", "Haythem Jouini"],
  BEL: ["Romelu Lukaku", "Leandro Trossard", "Jeremy Doku", "Kevin De Bruyne", "Lois Openda"],
  EGY: ["Mohamed Salah", "Mostafa Mohamed", "Trézéguet", "Omar Marmoush"],
  IRN: ["Mehdi Taremi", "Sardar Azmoun", "Alireza Jahanbakhsh", "Samaman Ghoddos"],
  NZL: ["Chris Wood", "Ben Waine", "Elijah Just"],
  ESP: ["Lamine Yamal", "Nico Williams", "Álvaro Morata", "Dani Olmo", "Ferran Torres", "Rodri"],
  CPV: ["Ryan Mendes", "Garry Rodrigues", "Jovane Cabral", "Bebé"],
  KSA: ["Salem Al-Dawsari", "Firas Al-Buraikan", "Saleh Al-Shehri"],
  URU: ["Darwin Núñez", "Federico Valverde", "Facundo Pellistri", "Luis Suárez", "Giorgian de Arrascaeta"],
  FRA: ["Kylian Mbappé", "Antoine Griezmann", "Olivier Giroud", "Ousmane Dembélé", "Marcus Thuram", "Kingsley Coman"],
  SEN: ["Sadio Mané", "Nicolas Jackson", "Ismaïla Sarr", "Pape Matar Sarr"],
  IRQ: ["Aymen Hussein", "Mohanad Ali", "Ali Jasim", "Ibrahim Bayesh"],
  NOR: ["Erling Haaland", "Martin Ødegaard", "Alexander Sørloth", "Oscar Bobb"],
  ARG: ["Lionel Messi", "Lautaro Martínez", "Julián Álvarez", "Enzo Fernández", "Alexis Mac Allister", "Rodrigo De Paul"],
  ALG: ["Riyad Mahrez", "Amine Gouiri", "Baghdad Bounedjah", "Houssem Aouar"],
  AUT: ["Marcel Sabitzer", "Christoph Baumgartner", "Michael Gregoritsch", "Konrad Laimer"],
  JOR: ["Musa Al-Taamari", "Yazan Al-Naimat", "Ali Olwan", "Hamza Al-Dardour"],
  POR: ["Cristiano Ronaldo", "Bruno Fernandes", "Rafael Leão", "João Félix", "Gonçalo Ramos", "Bernardo Silva"],
  COD: ["Yoane Wissa", "Cédric Bakambu", "Chancel Mbemba", "Theo Bongonda", "Meschak Elia"],
  UZB: ["Eldor Shomurodov", "Jaloliddin Masharipov", "Oston Urunov", "Abbosbek Fayzullaev"],
  COL: ["Luis Díaz", "James Rodríguez", "Rafael Santos Borré", "Jhon Durán", "Mateus Uribe"],
  ENG: ["Harry Kane", "Jude Bellingham", "Bukayo Saka", "Phil Foden", "Ollie Watkins", "Cole Palmer"],
  CRO: ["Andrej Kramarić", "Luka Modrić", "Mario Pašalić", "Bruno Petković"],
  GHA: ["Mohammed Kudus", "Inaki Williams", "Jordan Ayew", "Antoine Semenyo"],
  PAN: ["Adalberto Carrasquilla", "José Fajardo", "Cecilio Waterman", "Ismael Díaz"]
};

const GENERIC_SCORERS = ["G. Martínez", "M. Kovac", "J. Silva", "A. Ndoye", "K. Hansen", "P. Jones", "R. Schmidt", "S. Rossi"];

export default function App() {
  const [matches, setMatches] = useState<Match[]>(() => {
    let baseMatches = MATCHES;
    // Intentar cargar estado anterior del simulador si existe
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("wc2026_matches_official");
      if (saved) {
        try {
          baseMatches = JSON.parse(saved);
        } catch (e) {
          console.error("Error loading saved matches", e);
        }
      }
    }
    // Asegurar que todos tengan odds (simuladas por defecto si no existen)
    return baseMatches.map(m => {
      if (!m.polymarketOdds) {
        return {
          ...m,
          polymarketOdds: getSimulatedOdds(m.homeTeamId, m.awayTeamId)
        };
      }
      return m;
    });
  });

  const [liveEvents, setLiveEvents] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("wc2026_live_events_official");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Error loading saved events", e);
        }
      }
    }
    return [];
  });

  const [isSimulating, setIsSimulating] = useState(false);
  
  // Sincronización en vivo
  const [isLiveSync, setIsLiveSync] = useState(false);

  // Sincronización de Polymarket
  const [isSyncingPolymarket, setIsSyncingPolymarket] = useState(false);

  const syncPolymarketOdds = useCallback(async () => {
    setIsSyncingPolymarket(true);
    try {
      const matchesSimpleList = MATCHES.map(m => ({
        id: m.id,
        homeTeamId: m.homeTeamId,
        awayTeamId: m.awayTeamId
      }));
      const odds = await fetchPolymarketOdds(matchesSimpleList);
      setMatches(prev => prev.map(m => {
        if (odds[m.id]) {
          return {
            ...m,
            polymarketOdds: odds[m.id]
          };
        }
        return m;
      }));
    } catch (e) {
      console.error("Error syncing Polymarket odds", e);
    } finally {
      setIsSyncingPolymarket(false);
    }
  }, []);

  // Sincronizar odds automáticamente al montar la aplicación
  useEffect(() => {
    syncPolymarketOdds();
  }, [syncPolymarketOdds]);
  
  // Filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [selectedStatus, setSearchQueryState] = useState("all");
  
  // Custom setter wrappers to sync filters state
  const setSelectedStatus = (status: string) => {
    setSearchQueryState(status);
  };

  // Recordatorios e integración de notificaciones web
  const {
    permission,
    requestPermission,
    scheduleReminder,
    removeReminder,
    hasReminder,
    getReminderOffset
  } = useNotifications();

  const [activeCalendarMatch, setActiveCalendarMatch] = useState<MatchWithDetails | null>(null);

  // Sincronizar partidos y eventos con localStorage
  useEffect(() => {
    localStorage.setItem("wc2026_matches_official", JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem("wc2026_live_events_official", JSON.stringify(liveEvents));
  }, [liveEvents]);

  // Si el usuario selecciona un filtro de grupo, mostramos la tabla de ese grupo en el panel lateral
  const [selectedStandingsGroup, setSelectedStandingsGroup] = useState("A");
  useEffect(() => {
    if (selectedGroup !== "All") {
      setSelectedStandingsGroup(selectedGroup);
    }
  }, [selectedGroup]);

  // Función auxiliar para agregar eventos
  const addLiveEvent = useCallback((event: string) => {
    setLiveEvents(prev => [...prev, event]);
  }, []);



  const updateMatchesFromApi = useCallback((apiMatches: any[]) => {
    setMatches(prevMatches => {
      let changed = false;
      let newEvents: string[] = [];

      const updated = prevMatches.map(localMatch => {
        const apiMatch = apiMatches.find(m => m.id === localMatch.id);
        if (!apiMatch) return localMatch;

        const homeScore = parseInt(apiMatch.home_score) || 0;
        const awayScore = parseInt(apiMatch.away_score) || 0;

        let status: "scheduled" | "live" | "finished" = "scheduled";
        if (apiMatch.finished === "TRUE" || apiMatch.finished === true || apiMatch.finished === "true") {
          status = "finished";
        } else if (apiMatch.time_elapsed && apiMatch.time_elapsed !== "notstarted") {
          status = "live";
        }

        let timeElapsed = 0;
        if (status === "finished") {
          timeElapsed = 90;
        } else if (status === "live") {
          timeElapsed = parseInt(apiMatch.time_elapsed) || 45;
        }

        let homeScorers: string[] = [];
        let awayScorers: string[] = [];
        try {
          if (apiMatch.home_scorers && apiMatch.home_scorers !== "null") {
            homeScorers = apiMatch.home_scorers.split(",").map((s: string) => s.trim()).filter(Boolean);
          }
        } catch (e) {}
        try {
          if (apiMatch.away_scorers && apiMatch.away_scorers !== "null") {
            awayScorers = apiMatch.away_scorers.split(",").map((s: string) => s.trim()).filter(Boolean);
          }
        } catch (e) {}

        if (
          localMatch.homeScore !== homeScore ||
          localMatch.awayScore !== awayScore ||
          localMatch.status !== status ||
          localMatch.timeElapsed !== timeElapsed
        ) {
          changed = true;
          const homeName = getTeamById(localMatch.homeTeamId)?.name || localMatch.homeTeamId;
          const awayName = getTeamById(localMatch.awayTeamId)?.name || localMatch.awayTeamId;

          if (localMatch.status === "scheduled" && status === "live") {
            newEvents.push(`🎬 ¡Comienza el partido! ${homeName} vs ${awayName} (en vivo).`);
          } else if (localMatch.status === "live" && status === "finished") {
            newEvents.push(`🏁 Final del partido: ${homeName} ${homeScore} - ${awayScore} ${awayName}.`);
          } else if (homeScore > localMatch.homeScore) {
            const scorer = homeScorers[homeScorers.length - 1] || "Goleador";
            newEvents.push(`⚽ [API] ¡GOOOL de ${homeName}! ${scorer} anota el ${homeScore} - ${awayScore}.`);
          } else if (awayScore > localMatch.awayScore) {
            const scorer = awayScorers[awayScorers.length - 1] || "Goleador";
            newEvents.push(`⚽ [API] ¡GOOOL de ${awayName}! ${scorer} anota el ${homeScore} - ${awayScore}.`);
          }

          if (permission === "granted" && typeof window !== "undefined" && window.Notification) {
            if (homeScore > localMatch.homeScore || awayScore > localMatch.awayScore) {
              new Notification("⚽ ¡GOOOL EN VIVO!", {
                body: `${homeName} ${homeScore} - ${awayScore} ${awayName}`,
                tag: `match-goal-${localMatch.id}`
              });
            }
          }
          
          return {
            ...localMatch,
            homeScore,
            awayScore,
            homeScorers,
            awayScorers,
            status,
            timeElapsed,
            finished: status === "finished"
          };
        }
        return localMatch;
      });

      if (newEvents.length > 0) {
        setLiveEvents(prev => [...prev, ...newEvents]);
      }

      return changed ? updated : prevMatches;
    });
  }, [permission]);

  // Efecto de polling de internet
  useEffect(() => {
    if (!isLiveSync) return;

    const fetchLiveScores = () => {
      fetch("https://worldcup26.ir/get/games")
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            updateMatchesFromApi(data);
          }
        })
        .catch(err => {
          console.error("Error fetching live scores:", err);
        });
    };

    fetchLiveScores();
    const interval = setInterval(fetchLiveScores, 30000);
    return () => clearInterval(interval);
  }, [isLiveSync, updateMatchesFromApi]);

  // Función para obtener un goleador realista de una selección
  const getRandomScorer = (teamId: string): string => {
    const scorers = POPULAR_SCORERS[teamId];
    if (scorers && scorers.length > 0) {
      return scorers[Math.floor(Math.random() * scorers.length)];
    }
    return GENERIC_SCORERS[Math.floor(Math.random() * GENERIC_SCORERS.length)];
  };

  // Lógica del simulador (efecto secundario con temporizador)
  useEffect(() => {
    let interval: any = null;

    if (isSimulating) {
      interval = setInterval(() => {
        setMatches(prevMatches => {
          const newMatches = prevMatches.map(match => {
            // Solo simulamos los partidos de la Jornada 1 que no hayan terminado
            if (match.matchday === 1 && !match.finished) {
              let newStatus: "scheduled" | "live" | "finished" = match.status;
              let newTimeElapsed = match.timeElapsed;
              let newHomeScore = match.homeScore;
              let newAwayScore = match.awayScore;
              const newHomeScorers = [...match.homeScorers];
              const newAwayScorers = [...match.awayScorers];

              const homeName = getTeamById(match.homeTeamId)?.name || match.homeTeamId;
              const awayName = getTeamById(match.awayTeamId)?.name || match.awayTeamId;
              const stadiumName = STADIUMS.find(s => s.id === match.stadiumId)?.name || "Estadio";

              // 1. Comenzar partido si está programado
              if (match.status === "scheduled") {
                newStatus = "live";
                newTimeElapsed = 1;
                
                // Añadir evento al ticker con retraso cero (inmediato)
                setTimeout(() => {
                  addLiveEvent(`🎬 ¡Comienza el partido! ${homeName} vs ${awayName} en el ${stadiumName}.`);
                }, 0);
              } else if (match.status === "live") {
                // 2. Incrementar minutero (+3 minutos por tick para agilidad)
                newTimeElapsed += 3;

                if (newTimeElapsed >= 90) {
                  newStatus = "finished";
                  newTimeElapsed = 90;
                  setTimeout(() => {
                    addLiveEvent(`🏁 Final del partido: ${homeName} ${newHomeScore} - ${newAwayScore} ${awayName}.`);
                  }, 0);
                } else {
                  // 3. Probabilidad de goles (7% por tick)
                  const scoreRoll = Math.random();
                  if (scoreRoll < 0.07) {
                    const isHomeGoal = Math.random() < 0.55; // ligera ventaja local
                    const scorer = getRandomScorer(isHomeGoal ? match.homeTeamId : match.awayTeamId);
                    
                    if (isHomeGoal) {
                      newHomeScore += 1;
                      newHomeScorers.push(`${scorer} (${newTimeElapsed}')`);
                      setTimeout(() => {
                        addLiveEvent(`⚽ ¡GOOOL de ${homeName}! ${scorer} anota el ${newHomeScore} - ${newAwayScore} (${newTimeElapsed}').`);
                      }, 0);
                    } else {
                      newAwayScore += 1;
                      newAwayScorers.push(`${scorer} (${newTimeElapsed}')`);
                      setTimeout(() => {
                        addLiveEvent(`⚽ ¡GOOOL de ${awayName}! ${scorer} anota el ${newHomeScore} - ${newAwayScore} (${newTimeElapsed}').`);
                      }, 0);
                    }
                  }
                }
              }

              return {
                ...match,
                status: newStatus,
                timeElapsed: newTimeElapsed,
                homeScore: newHomeScore,
                awayScore: newAwayScore,
                homeScorers: newHomeScorers,
                awayScorers: newAwayScorers,
                finished: newStatus === "finished"
              };
            }
            return match;
          });

          // Si ya se terminaron todos los partidos, pausar
          const activeGames = newMatches.some(m => m.matchday === 1 && !m.finished);
          if (!activeGames) {
            setIsSimulating(false);
            setTimeout(() => {
              addLiveEvent("🏆 ¡Todos los partidos de la jornada simulada han finalizado!");
            }, 0);
          }

          return newMatches;
        });
      }, 2000); // Ticks cada 2 segundos
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimulating, addLiveEvent]);

  // Simulación rápida instantánea
  const handleQuickSimulateAll = () => {
    setIsSimulating(false);
    
    setMatches(prevMatches => {
      const simulated = prevMatches.map(match => {
        if (match.finished) return match;

        // Marcadores realistas entre 0 y 4
        const homeScore = Math.floor(Math.random() * 4);
        const awayScore = Math.floor(Math.random() * 3);
        
        const homeScorers: string[] = [];
        const awayScorers: string[] = [];

        for (let i = 0; i < homeScore; i++) {
          const min = Math.floor(Math.random() * 88) + 1;
          homeScorers.push(`${getRandomScorer(match.homeTeamId)} (${min}')`);
        }

        for (let i = 0; i < awayScore; i++) {
          const min = Math.floor(Math.random() * 88) + 1;
          awayScorers.push(`${getRandomScorer(match.awayTeamId)} (${min}')`);
        }

        return {
          ...match,
          status: "finished" as const,
          finished: true,
          timeElapsed: 90,
          homeScore,
          awayScore,
          homeScorers: homeScorers.sort(),
          awayScorers: awayScorers.sort()
        };
      });

      // Añadir eventos en el ticker
      const events: string[] = [];
      simulated.forEach(m => {
        const home = getTeamById(m.homeTeamId)?.name || m.homeTeamId;
        const away = getTeamById(m.awayTeamId)?.name || m.awayTeamId;
        events.push(`⚡ [Simulado] Final: ${home} ${m.homeScore} - ${m.awayScore} ${away}`);
      });
      setLiveEvents(prev => [...prev, ...events]);

      return simulated;
    });
  };

  // Reiniciar simulador
  const handleResetSimulation = () => {
    setIsSimulating(false);
    setMatches(MATCHES.map(m => ({
      ...m,
      polymarketOdds: getSimulatedOdds(m.homeTeamId, m.awayTeamId)
    })));
    setLiveEvents([]);
    localStorage.removeItem("wc2026_matches_official");
    localStorage.removeItem("wc2026_live_events_official");
    addLiveEvent("🔄 Simulador restablecido. Todos los marcadores han vuelto a cero.");
    syncPolymarketOdds();
  };

  // Convertir base de partidos a modelo ampliado con banderas y estadios
  const matchesWithDetails = getMatchesWithDetails(matches);

  // Filtrar partidos en base al buscador, grupo y estado seleccionado
  const filteredMatches = matchesWithDetails.filter(match => {
    // 1. Filtrar por texto de búsqueda (nombre de equipos)
    const matchesSearch = 
      match.homeTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.awayTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.homeTeam.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.awayTeam.code.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Filtrar por grupo
    const matchesGroup = selectedGroup === "All" || match.group === selectedGroup;

    // 3. Filtrar por estado
    const matchesStatus = selectedStatus === "all" || match.status === selectedStatus;

    return matchesSearch && matchesGroup && matchesStatus;
  });

  // Dividir partidos filtrados por categorías
  const liveMatches = filteredMatches.filter(m => m.status === "live");
  const upcomingMatches = filteredMatches.filter(m => m.status === "scheduled");
  const finishedMatches = filteredMatches.filter(m => m.status === "finished");

  return (
    <div className="app-container">
      {/* Cabecera */}
      <header className="header">
        <div className="logo-section">
          <WC26Logo size={36} />
          <div>
            <h1 className="logo-title">Notify My World Cup</h1>
            <p className="logo-subtitle">Mundial FIFA 2026 | Marcadores en vivo y Alertas de Calendario</p>
          </div>
        </div>

        {/* Sincronización en vivo e Notificaciones */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Live Sync Toggle */}
          <button 
            onClick={() => {
              setIsLiveSync(prev => !prev);
              setIsSimulating(false); // Detener simulador manual
            }}
            className={`glass-button ${isLiveSync ? "active" : ""}`}
            style={{ 
              fontSize: "0.85rem", 
              gap: "8px", 
              borderColor: isLiveSync ? "var(--neon-blue)" : "rgba(0, 240, 255, 0.25)",
              color: isLiveSync ? "#040613" : "white"
            }}
          >
            <span style={{ 
              display: "inline-block", 
              width: "8px", 
              height: "8px", 
              background: isLiveSync ? "#040613" : "var(--neon-blue)", 
              borderRadius: "50%",
              animation: isLiveSync ? "pulse 1.2s infinite" : "none" 
            }} />
            <span>{isLiveSync ? "📡 Sincronizando..." : "📡 Sincronizar en Vivo"}</span>
          </button>

          {/* Polymarket Sync Toggle */}
          <button 
            onClick={syncPolymarketOdds}
            disabled={isSyncingPolymarket}
            className={`glass-button ${isSyncingPolymarket ? "active" : ""}`}
            style={{ 
              fontSize: "0.85rem", 
              gap: "8px", 
              borderColor: isSyncingPolymarket ? "var(--neon-purple)" : "rgba(139, 92, 246, 0.4)",
              color: isSyncingPolymarket ? "#040613" : "white",
              cursor: isSyncingPolymarket ? "wait" : "pointer"
            }}
          >
            <span style={{ 
              display: "inline-block", 
              width: "8px", 
              height: "8px", 
              background: isSyncingPolymarket ? "#040613" : "var(--neon-purple)", 
              borderRadius: "50%",
              animation: isSyncingPolymarket ? "pulse 1.2s infinite" : "none" 
            }} />
            <span>{isSyncingPolymarket ? "🔮 Sincronizando..." : "🔮 Sincronizar Polymarket"}</span>
          </button>

          {permission === "granted" ? (
            <div 
              className="glass-panel" 
              style={{ 
                padding: "8px 16px", 
                borderRadius: "var(--radius-md)", 
                display: "flex", 
                alignItems: "center", 
                gap: "8px",
                borderColor: "rgba(0, 255, 136, 0.2)",
                fontSize: "0.85rem"
              }}
            >
              <Bell size={16} style={{ color: "var(--neon-green)" }} />
              <span style={{ color: "var(--color-text-primary)" }}>Alertas de navegador Activas</span>
            </div>
          ) : (
            <button 
              onClick={requestPermission}
              className="glass-button" 
              style={{ fontSize: "0.85rem", gap: "8px", borderColor: "rgba(139, 92, 246, 0.4)" }}
            >
              <BellOff size={16} style={{ color: "var(--neon-purple)" }} />
              <span>Habilitar Alertas Web</span>
            </button>
          )}
        </div>
      </header>

      {/* Sección Hero de Bienvenida y Explicación */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: "16px 20px", 
          display: "flex", 
          flexDirection: "column",
          gap: "12px"
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
          <div>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.02em", color: "white" }}>
              🏆 Planifica tu Mundial 2026 en tu Calendario
            </h2>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.8rem", marginTop: "2px", maxWidth: "800px", lineHeight: "1.35" }}>
              Sigue los marcadores en tiempo real, simula resultados para calcular posiciones y programa recordatorios a tu medida.
            </p>
          </div>
          <div style={{ 
            display: "flex", 
            gap: "8px", 
            background: "rgba(204, 255, 0, 0.04)", 
            border: "1px dashed rgba(204, 255, 0, 0.25)", 
            padding: "8px 12px", 
            borderRadius: "var(--radius-md)", 
            alignItems: "center" 
          }}>
            <span style={{ 
              display: "inline-block", 
              width: "7px", 
              height: "7px", 
              background: "var(--neon-green)", 
              borderRadius: "50%", 
              animation: "pulse 1.5s infinite" 
            }} />
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--neon-green)", textTransform: "uppercase" }}>
              El Mundial arranca mañana (11 de Junio)
            </span>
          </div>
        </div>

        {/* Guía de Funcionalidades */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginTop: "4px" }}>
          <div className="info-step-card">
            <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--neon-blue)", textTransform: "uppercase", marginBottom: "6px" }}>
              1. Elige tu Partido
            </h3>
            <p style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", lineHeight: "1.4" }}>
              Usa los buscadores y filtros de grupos de abajo para localizar los enfrentamientos oficiales de tus selecciones favoritas de forma rápida.
            </p>
          </div>

          <div className="info-step-card">
            <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--neon-green)", textTransform: "uppercase", marginBottom: "6px" }}>
              2. Personaliza tu Alerta
            </h3>
            <p style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", lineHeight: "1.4" }}>
              Haz clic en "Recordatorio". Puedes programar alertas para que te avisen al momento del pitido inicial, 15m, 1h, o incluso un día antes del juego.
            </p>
          </div>

          <div className="info-step-card">
            <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--neon-pink)", textTransform: "uppercase", marginBottom: "6px" }}>
              3. Sincroniza al Instante
            </h3>
            <p style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", lineHeight: "1.4" }}>
              Descarga el archivo <strong>.ics</strong> para Apple y Outlook, agrégalo a tu <strong>Google Calendar</strong> o activa las <strong>alertas web</strong> locales de esta pestaña.
            </p>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <main className="dashboard-grid">
        
        {/* Columna Izquierda: Filtros y Partidos */}
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <MatchFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />

          {/* Listado de partidos divididos por sección */}
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            
            {/* PARTIDOS EN VIVO */}
            {liveMatches.length > 0 && (
              <div>
                <h2 style={{ 
                  fontSize: "1.05rem", 
                  fontWeight: 800, 
                  textTransform: "uppercase", 
                  letterSpacing: "0.08em",
                  color: "var(--neon-pink)",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <span style={{ display: "inline-block", width: "8px", height: "8px", background: "var(--neon-pink)", borderRadius: "50%", animation: "pulse 1.5s infinite" }} />
                  Partidos en Directo
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
                  {liveMatches.map(match => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      onOpenCalendar={setActiveCalendarMatch}
                      hasReminder={hasReminder(match.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* PARTIDOS PRÓXIMOS */}
            {upcomingMatches.length > 0 && (
              <div>
                <h2 style={{ 
                  fontSize: "1.05rem", 
                  fontWeight: 800, 
                  textTransform: "uppercase", 
                  letterSpacing: "0.08em",
                  color: "var(--neon-green)",
                  marginBottom: "12px"
                }}>
                  Próximos Partidos ({upcomingMatches.length})
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
                  {upcomingMatches.map(match => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      onOpenCalendar={setActiveCalendarMatch}
                      hasReminder={hasReminder(match.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* PARTIDOS FINALIZADOS */}
            {finishedMatches.length > 0 && (
              <div>
                <h2 style={{ 
                  fontSize: "1.05rem", 
                  fontWeight: 800, 
                  textTransform: "uppercase", 
                  letterSpacing: "0.08em",
                  color: "var(--color-text-secondary)",
                  marginBottom: "12px"
                }}>
                  Partidos Finalizados ({finishedMatches.length})
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
                  {finishedMatches.map(match => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      onOpenCalendar={setActiveCalendarMatch}
                      hasReminder={hasReminder(match.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* No se encontraron partidos */}
            {filteredMatches.length === 0 && (
              <div 
                className="glass-panel" 
                style={{ 
                  padding: "40px", 
                  textAlign: "center", 
                  color: "var(--color-text-secondary)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px"
                }}
              >
                <HelpCircle size={40} style={{ color: "var(--color-text-muted)" }} />
                <div>
                  <h3 style={{ color: "white", marginBottom: "4px" }}>No se encontraron partidos</h3>
                  <p style={{ fontSize: "0.9rem" }}>Prueba a cambiar los criterios de búsqueda o los filtros de grupos.</p>
                </div>
              </div>
            )}

          </div>

        </section>

        {/* Columna Derecha: Simulador y Posiciones */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <SimulatorControl
            isSimulating={isSimulating}
            onToggleSimulation={() => setIsSimulating(!isSimulating)}
            onResetSimulation={handleResetSimulation}
            onQuickSimulateAll={handleQuickSimulateAll}
            liveEvents={liveEvents}
            isLiveSync={isLiveSync}
          />

          {/* Selector de Clasificación del Grupo Lateral */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", gap: "6px", alignItems: "center", fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>
              <span>Ver Tabla del:</span>
              <select 
                value={selectedStandingsGroup}
                onChange={(e) => setSelectedStandingsGroup(e.target.value)}
                className="glass-input"
                style={{ 
                  padding: "4px 8px", 
                  fontSize: "0.8rem", 
                  borderRadius: "var(--radius-sm)", 
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid var(--border-glass)" 
                }}
              >
                {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"].map(g => (
                  <option key={g} value={g} style={{ backgroundColor: "var(--bg-dark)" }}>Grupo {g}</option>
                ))}
              </select>
            </div>
            
            <GroupStandings
              group={selectedStandingsGroup}
              matches={matches}
            />
          </div>

        </aside>

      </main>

      {/* Modal de Calendario */}
      {activeCalendarMatch && (
        <CalendarModal
          match={activeCalendarMatch}
          onClose={() => setActiveCalendarMatch(null)}
          hasReminder={hasReminder(activeCalendarMatch.id)}
          reminderOffset={getReminderOffset(activeCalendarMatch.id)}
          onScheduleReminder={(offset) => {
            scheduleReminder(
              activeCalendarMatch.id,
              activeCalendarMatch.date,
              activeCalendarMatch.homeTeam.name,
              activeCalendarMatch.awayTeam.name,
              offset
            );
            setActiveCalendarMatch(null);
          }}
          onRemoveReminder={() => {
            removeReminder(activeCalendarMatch.id);
            setActiveCalendarMatch(null);
          }}
          permission={permission}
          onRequestPermission={requestPermission}
        />
      )}

      {/* Pie de Página */}
      <footer style={{ 
        marginTop: "40px", 
        borderTop: "1px solid var(--border-glass)", 
        paddingTop: "20px", 
        textAlign: "center", 
        fontSize: "0.8rem", 
        color: "var(--color-text-muted)" 
      }}>
        © 2026 Notify My World Cup. Creado con fines informativos y simulación interactiva para la Copa Mundial de la FIFA 2026.
      </footer>
    </div>
  );
}
