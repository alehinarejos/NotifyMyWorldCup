import React, { useMemo } from "react";
import { TEAMS } from "../data/teams";
import type { Team } from "../data/teams";
import type { Match } from "../data/matches";

interface GroupStandingsProps {
  group: string; // "A" - "L"
  matches: Match[];
}

interface TeamStats {
  team: Team;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export const GroupStandings: React.FC<GroupStandingsProps> = ({
  group,
  matches
}) => {
  // Filtrar los equipos del grupo seleccionado
  const groupTeams = useMemo(() => {
    return TEAMS.filter(t => t.group === group);
  }, [group]);

  // Calcular las estadísticas en tiempo real basándose en los partidos
  const standings = useMemo((): TeamStats[] => {
    const statsMap: Record<string, TeamStats> = {};
    
    // Inicializar mapa de estadísticas para cada equipo en el grupo
    groupTeams.forEach(team => {
      statsMap[team.id] = {
        team,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0
      };
    });

    // Calcular datos de los partidos terminados o en juego
    matches.forEach(match => {
      if (match.group !== group) return;
      if (match.status === "scheduled") return; // Ignorar partidos futuros

      const homeStats = statsMap[match.homeTeamId];
      const awayStats = statsMap[match.awayTeamId];

      // Si por alguna razón no están mapeados (ej: equipos de otros grupos), ignorar
      if (!homeStats || !awayStats) return;

      homeStats.played += 1;
      awayStats.played += 1;

      homeStats.goalsFor += match.homeScore;
      homeStats.goalsAgainst += match.awayScore;
      awayStats.goalsFor += match.awayScore;
      awayStats.goalsAgainst += match.homeScore;

      if (match.homeScore > match.awayScore) {
        homeStats.wins += 1;
        homeStats.points += 3;
        awayStats.losses += 1;
      } else if (match.homeScore < match.awayScore) {
        awayStats.wins += 1;
        awayStats.points += 3;
        homeStats.losses += 1;
      } else {
        homeStats.draws += 1;
        homeStats.points += 1;
        awayStats.draws += 1;
        awayStats.points += 1;
      }
    });

    // Calcular diferencia de goles y convertir a array
    const standingsList = Object.values(statsMap).map(stat => {
      stat.goalDifference = stat.goalsFor - stat.goalsAgainst;
      return stat;
    });

    // Ordenar posiciones: 1) Puntos, 2) Diferencia de Goles, 3) Goles a Favor, 4) Nombre
    return standingsList.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      return a.team.name.localeCompare(b.team.name);
    });
  }, [groupTeams, matches, group]);

  return (
    <div className="glass-panel" style={{ padding: "12px 14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <h3 style={{ fontSize: "0.95rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.03em" }}>
          Clasificación - Grupo {group}
        </h3>
        <span style={{ fontSize: "0.7rem", color: "var(--neon-blue)", fontWeight: 600 }}>Fase de Grupos</span>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="standings-table">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--color-text-secondary)" }}>
              <th className="col-num">#</th>
              <th className="col-team">Selección</th>
              <th className="col-stat">PJ</th>
              <th className="col-stat">G</th>
              <th className="col-stat">E</th>
              <th className="col-stat">P</th>
              <th className="col-stat col-dg">DG</th>
              <th className="col-stat col-pts" style={{ fontWeight: 700, color: "var(--color-text-primary)" }}>Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((stat, index) => {
              const isQualifying = index < 2; // Clasifican los 2 primeros
              return (
                <tr 
                  key={stat.team.id} 
                  style={{ 
                    borderBottom: "1px solid rgba(255,255,255,0.02)",
                    background: index % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent"
                  }}
                >
                  {/* Posición */}
                  <td className="col-num" style={{ 
                    fontWeight: 700,
                    color: isQualifying ? "var(--neon-green)" : "var(--color-text-muted)",
                    borderLeft: isQualifying ? "2px solid var(--neon-green)" : "2px solid transparent"
                  }}>
                    {index + 1}
                  </td>
                  
                  {/* Bandera y Nombre */}
                  <td className="col-team" style={{ fontWeight: 600 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <img 
                        src={stat.team.flagUrl} 
                        alt={`Bandera de ${stat.team.name}`} 
                        className="wc-flag-sm" 
                      />
                      <span className="team-name-text">{stat.team.name}</span>
                    </div>
                  </td>

                  {/* PJ, G, E, P */}
                  <td className="col-stat" style={{ color: "var(--color-text-secondary)" }}>{stat.played}</td>
                  <td className="col-stat" style={{ color: "var(--color-text-secondary)" }}>{stat.wins}</td>
                  <td className="col-stat" style={{ color: "var(--color-text-secondary)" }}>{stat.draws}</td>
                  <td className="col-stat" style={{ color: "var(--color-text-secondary)" }}>{stat.losses}</td>
                  
                  {/* Diferencia de goles */}
                  <td className="col-stat col-dg" style={{ 
                    fontWeight: 600,
                    color: stat.goalDifference > 0 
                      ? "var(--neon-green)" 
                      : stat.goalDifference < 0 
                        ? "#f87171" 
                        : "var(--color-text-secondary)"
                  }}>
                    {stat.goalDifference > 0 ? `+${stat.goalDifference}` : stat.goalDifference}
                  </td>

                  {/* Puntos */}
                  <td className="col-stat col-pts" style={{ 
                    fontWeight: 700, 
                    color: isQualifying ? "var(--neon-blue)" : "var(--color-text-primary)"
                  }}>
                    {stat.points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ display: "flex", gap: "10px", marginTop: "12px", fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ display: "inline-block", width: "8px", height: "8px", background: "var(--neon-green)", borderRadius: "2px" }} />
          Clasifica a Dieciseisavos
        </div>
      </div>
    </div>
  );
};
