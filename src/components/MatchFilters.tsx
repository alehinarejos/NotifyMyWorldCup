import React from "react";
import { Search } from "lucide-react";

interface MatchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedGroup: string;
  setSelectedGroup: (group: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
}

export const MatchFilters: React.FC<MatchFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedGroup,
  setSelectedGroup,
  selectedStatus,
  setSelectedStatus
}) => {
  const groups = ["All", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
  const statuses = [
    { value: "all", label: "Todos" },
    { value: "scheduled", label: "Próximos" },
    { value: "live", label: "En Vivo" },
    { value: "finished", label: "Terminados" }
  ];

  return (
    <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Buscador e Indicador de filtros */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ position: "relative", flex: "1 1 300px" }}>
          <Search 
            size={18} 
            style={{ 
              position: "absolute", 
              left: "14px", 
              top: "50%", 
              transform: "translateY(-50%)", 
              color: "var(--color-text-secondary)" 
            }} 
          />
          <input
            type="text"
            placeholder="Buscar por selección (ej: México, España...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input"
            style={{ width: "100%", paddingLeft: "42px" }}
          />
        </div>

        {/* Selector de Estado */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {statuses.map((s) => (
            <button
              key={s.value}
              onClick={() => setSelectedStatus(s.value)}
              className={`glass-button ${selectedStatus === s.value ? "active" : ""}`}
              style={{ padding: "8px 16px", fontSize: "0.9rem" }}
            >
              {s.value === "live" && selectedStatus !== "live" && (
                <span 
                  style={{ 
                    display: "inline-block", 
                    width: "8px", 
                    height: "8px", 
                    background: "var(--neon-pink)", 
                    borderRadius: "50%", 
                    marginRight: "6px" 
                  }} 
                />
              )}
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Selector de Grupos */}
      <div>
        <span style={{ 
          display: "block", 
          fontSize: "0.85rem", 
          color: "var(--color-text-secondary)", 
          marginBottom: "8px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em"
        }}>
          Filtrar por Grupo
        </span>
        <div style={{ 
          display: "flex", 
          gap: "8px", 
          overflowX: "auto", 
          paddingBottom: "8px",
          scrollbarWidth: "thin"
        }}>
          {groups.map((group) => (
            <button
              key={group}
              onClick={() => setSelectedGroup(group)}
              className={`glass-button ${selectedGroup === group ? "active" : ""}`}
              style={{ 
                padding: "6px 12px", 
                fontSize: "0.85rem",
                minWidth: "40px",
                flexShrink: 0
              }}
            >
              {group === "All" ? "Todos" : `Grupo ${group}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
