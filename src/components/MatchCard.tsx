import React, { useState, useEffect, useRef } from "react";
import { Calendar, Bell } from "lucide-react";
import type { MatchWithDetails } from "../data/matches";

interface MatchCardProps {
  match: MatchWithDetails;
  onOpenCalendar: (match: MatchWithDetails) => void;
  hasReminder: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  onOpenCalendar,
  hasReminder
}) => {
  const [goalFlash, setGoalFlash] = useState(false);
  const prevTotalScore = useRef(match.homeScore + match.awayScore);

  useEffect(() => {
    const currentScore = match.homeScore + match.awayScore;
    if (currentScore > prevTotalScore.current) {
      setGoalFlash(true);
      const timer = setTimeout(() => setGoalFlash(false), 1800);
      prevTotalScore.current = currentScore;
      return () => clearTimeout(timer);
    }
    prevTotalScore.current = currentScore;
  }, [match.homeScore, match.awayScore]);
  // Convertir fecha a local
  const formattedTime = new Date(match.date).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit"
  });

  const formattedDate = new Date(match.date).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short"
  });

  // Clases y estilos condicionales basados en el estado
  const isLive = match.status === "live";
  const isFinished = match.status === "finished";

  return (
    <div 
      className={`glass-card animated-card ${goalFlash ? "goal-flash" : ""}`}
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        position: "relative",
        overflow: "hidden",
        border: isLive ? "1px solid rgba(236, 72, 153, 0.4)" : "1px solid var(--border-glass)",
        boxShadow: isLive ? "0 0 20px rgba(236, 72, 153, 0.15)" : undefined
      }}
    >
      {/* Brillo en vivo si corresponde */}
      {isLive && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "4px",
          height: "100%",
          background: "var(--neon-pink)"
        }} />
      )}

      {/* Cabecera de la Tarjeta */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8rem" }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", color: "var(--color-text-secondary)" }}>
          <span style={{ 
            background: "rgba(255,255,255,0.05)", 
            padding: "2px 8px", 
            borderRadius: "4px", 
            fontWeight: 600,
            color: "var(--neon-blue)"
          }}>
            Grupo {match.group}
          </span>
          <span>Jornada {match.matchday}</span>
        </div>

        {/* Estado */}
        {isLive ? (
          <div className="live-indicator">
            <span className="live-dot" />
            <span>En Vivo • {match.timeElapsed}'</span>
          </div>
        ) : isFinished ? (
          <span style={{ 
            color: "var(--color-text-muted)", 
            fontWeight: 700, 
            textTransform: "uppercase", 
            letterSpacing: "0.05em",
            background: "rgba(255,255,255,0.02)",
            padding: "2px 8px",
            borderRadius: "4px"
          }}>
            Finalizado
          </span>
        ) : (
          <span style={{ color: "var(--neon-green)", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
            Próximamente
          </span>
        )}
      </div>

      {/* Contenido Principal: Equipos y Marcador */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "10px 0", gap: "10px", width: "100%" }}>
        
        {/* Equipo Local */}
        <div className="card-team-container">
          <img 
            src={match.homeTeam.flagUrl} 
            alt={`Bandera de ${match.homeTeam.name}`} 
            className="wc-flag" 
          />
          <span className="card-team-name" title={match.homeTeam.name}>
            {match.homeTeam.name}
          </span>
        </div>

        {/* Marcador */}
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center", 
          width: "72px",
          flexShrink: 0,
          gap: "4px"
        }}>
          {!isLive && !isFinished ? (
            // No empezado: Muestra la Hora y Fecha
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--color-text-primary)" }}>
                {formattedTime}
              </span>
              <span style={{ fontSize: "0.7rem", color: "var(--color-text-secondary)", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                {formattedDate}
              </span>
            </div>
          ) : (
            // En vivo o Terminado: Muestra el Marcador
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "8px", 
              fontSize: "1.7rem", 
              fontWeight: 800,
              fontFamily: "var(--font-primary)"
            }}>
              <span style={{ color: isLive ? "var(--neon-blue)" : "white" }}>{match.homeScore}</span>
              <span style={{ color: "var(--color-text-muted)", fontSize: "1.1rem" }}>-</span>
              <span style={{ color: isLive ? "var(--neon-blue)" : "white" }}>{match.awayScore}</span>
            </div>
          )}
        </div>

        {/* Equipo Visitante */}
        <div className="card-team-container">
          <img 
            src={match.awayTeam.flagUrl} 
            alt={`Bandera de ${match.awayTeam.name}`} 
            className="wc-flag" 
          />
          <span className="card-team-name" title={match.awayTeam.name}>
            {match.awayTeam.name}
          </span>
        </div>
      </div>

      {/* Probabilidades de Victoria (Polymarket) */}
      {match.polymarketOdds && (
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: "6px",
          padding: "10px 12px",
          background: "rgba(255,255,255,0.02)",
          borderRadius: "var(--radius-md)",
          border: "1px solid rgba(255,255,255,0.04)",
          fontSize: "0.75rem"
        }}>
          {/* Cabecera del Indicador */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "var(--color-text-secondary)", fontWeight: 600 }}>
              Probabilidad de Victoria
            </span>
            
            {match.polymarketOdds.link ? (
              <a 
                href={match.polymarketOdds.link} 
                target="_blank" 
                rel="noopener noreferrer"
                title={match.polymarketOdds.question || "Ver en Polymarket"}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "4px",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  color: match.polymarketOdds.source === "official" ? "var(--neon-green)" : "var(--neon-purple)"
                }}
              >
                <span style={{ 
                  width: "6px", 
                  height: "6px", 
                  background: match.polymarketOdds.source === "official" ? "var(--neon-green)" : "var(--neon-purple)", 
                  borderRadius: "50%",
                  boxShadow: match.polymarketOdds.source === "official" 
                    ? "0 0 8px var(--neon-green)" 
                    : "0 0 8px var(--neon-purple)",
                  display: "inline-block"
                }} />
                <span>{match.polymarketOdds.source === "official" ? "Polymarket Oficial" : "Estimación"}</span>
              </a>
            ) : (
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "4px",
                fontWeight: 700,
                fontSize: "0.7rem",
                color: match.polymarketOdds.source === "official" ? "var(--neon-green)" : "var(--neon-purple)"
              }}>
                <span style={{ 
                  width: "6px", 
                  height: "6px", 
                  background: match.polymarketOdds.source === "official" ? "var(--neon-green)" : "var(--neon-purple)", 
                  borderRadius: "50%",
                  boxShadow: match.polymarketOdds.source === "official" 
                    ? "0 0 8px var(--neon-green)" 
                    : "0 0 8px var(--neon-purple)",
                  display: "inline-block"
                }} />
                <span>{match.polymarketOdds.source === "official" ? "Polymarket Oficial" : "Estimación"}</span>
              </div>
            )}
          </div>

          {/* Barra de Progreso Triple */}
          <div style={{ 
            height: "8px", 
            width: "100%", 
            background: "rgba(255,255,255,0.05)", 
            borderRadius: "4px", 
            overflow: "hidden",
            display: "flex",
            margin: "4px 0"
          }}>
            {/* Local Win */}
            <div style={{ 
              width: `${match.polymarketOdds.homeWin}%`, 
              height: "100%", 
              background: "linear-gradient(90deg, var(--neon-blue), #3b82f6)",
              transition: "width 0.5s ease-in-out"
            }} title={`Local (${match.homeTeam.code}): ${match.polymarketOdds.homeWin}%`} />
            
            {/* Draw */}
            <div style={{ 
              width: `${match.polymarketOdds.draw}%`, 
              height: "100%", 
              background: "rgba(255,255,255,0.15)",
              transition: "width 0.5s ease-in-out"
            }} title={`Empate: ${match.polymarketOdds.draw}%`} />
            
            {/* Away Win */}
            <div style={{ 
              width: `${match.polymarketOdds.awayWin}%`, 
              height: "100%", 
              background: "linear-gradient(90deg, var(--neon-pink), #ec4899)",
              transition: "width 0.5s ease-in-out"
            }} title={`Visitante (${match.awayTeam.code}): ${match.polymarketOdds.awayWin}%`} />
          </div>

          {/* Porcentajes Desglosados */}
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            fontSize: "0.68rem", 
            color: "var(--color-text-secondary)",
            fontWeight: 500
          }}>
            <span style={{ color: "var(--neon-blue)", fontWeight: 700 }}>
              {match.homeTeam.code} {match.polymarketOdds.homeWin}%
            </span>
            <span style={{ color: "var(--color-text-muted)" }}>
              Empate {match.polymarketOdds.draw}%
            </span>
            <span style={{ color: "var(--neon-pink)", fontWeight: 700 }}>
              {match.awayTeam.code} {match.polymarketOdds.awayWin}%
            </span>
          </div>
        </div>
      )}

      {/* Incidencias / Goleadores (si existen) */}
      {(match.homeScorers.length > 0 || match.awayScorers.length > 0) && (
        <div style={{ 
          fontSize: "0.75rem", 
          color: "var(--color-text-secondary)", 
          display: "flex", 
          justifyContent: "space-between",
          borderTop: "1px solid rgba(255,255,255,0.03)",
          paddingTop: "10px",
          gap: "12px"
        }}>
          <div style={{ width: "45%", textAlign: "right", display: "flex", flexDirection: "column" }}>
            {match.homeScorers.map((scorer, i) => (
              <span key={i}>⚽ {scorer}</span>
            ))}
          </div>
          <div style={{ width: "10%", textAlign: "center", color: "var(--color-text-muted)" }}>•</div>
          <div style={{ width: "45%", textAlign: "left", display: "flex", flexDirection: "column" }}>
            {match.awayScorers.map((scorer, i) => (
              <span key={i}>{scorer} ⚽</span>
            ))}
          </div>
        </div>
      )}

      {/* Pie de Tarjeta: Sede y Botón Recordatorio */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        borderTop: "1px solid rgba(255,255,255,0.05)",
        paddingTop: "14px",
        fontSize: "0.75rem",
        color: "var(--color-text-secondary)"
      }}>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "60%" }}>
          📍 {match.stadium.name} ({match.stadium.city})
        </span>

        {/* Botón de Acción */}
        {!isFinished && (
          <button
            onClick={() => onOpenCalendar(match)}
            className={`glass-button ${hasReminder ? "active" : ""}`}
            style={{ 
              padding: "6px 12px", 
              fontSize: "0.75rem",
              borderRadius: "var(--radius-sm)",
              gap: "4px"
            }}
          >
            {hasReminder ? (
              <>
                <Bell size={12} className="bell-pulse" style={{ color: "white" }} />
                <span>Alerta Activa</span>
              </>
            ) : (
              <>
                <Calendar size={12} />
                <span>Recordatorio</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
