import React from "react";
import { Play, Pause, RotateCcw, FastForward, Activity } from "lucide-react";

interface SimulatorControlProps {
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onResetSimulation: () => void;
  onQuickSimulateAll: () => void;
  liveEvents: string[];
  isLiveSync?: boolean;
}

export const SimulatorControl: React.FC<SimulatorControlProps> = ({
  isSimulating,
  onToggleSimulation,
  onResetSimulation,
  onQuickSimulateAll,
  liveEvents,
  isLiveSync = false
}) => {
  return (
    <div className="glass-panel" style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <Activity size={16} style={{ color: isLiveSync ? "var(--neon-blue)" : "var(--neon-green)" }} />
        <h3 style={{ fontSize: "0.95rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {isLiveSync ? "Sincronizador en Vivo" : "Simulador de Tiempo Real"}
        </h3>
      </div>

      <p style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", lineHeight: "1.35" }}>
        {isLiveSync 
          ? "Sincronización de internet activa. Los resultados y eventos de los estadios se actualizan automáticamente desde el servidor oficial." 
          : "¡Activa el simulador para hacer transcurrir los partidos del primer día en directo, ver marcadores y recibir alertas!"}
      </p>

      {/* Controles del simulador */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        <button
          onClick={onToggleSimulation}
          disabled={isLiveSync}
          className="glass-button primary"
          style={{ 
            flex: "1 1 110px", 
            padding: "5px 10px",
            fontSize: "0.7rem",
            background: isLiveSync ? "rgba(255,255,255,0.05)" : isSimulating ? "rgba(239, 68, 68, 0.15)" : undefined,
            border: isLiveSync ? "1px solid var(--border-color)" : isSimulating ? "1px solid rgb(239, 68, 68)" : undefined,
            color: isLiveSync ? "var(--color-text-muted)" : isSimulating ? "rgb(239, 68, 68)" : undefined,
            boxShadow: !isLiveSync && isSimulating ? "0 0 10px rgba(239, 68, 68, 0.3)" : undefined,
            cursor: isLiveSync ? "not-allowed" : "pointer"
          }}
        >
          {isSimulating ? (
            <>
              <Pause size={14} />
              <span>Pausar</span>
            </>
          ) : (
            <>
              <Play size={14} />
              <span>Iniciar En Vivo</span>
            </>
          )}
        </button>

        <button
          onClick={onQuickSimulateAll}
          disabled={isLiveSync}
          className="glass-button"
          style={{ 
            flex: "1 1 90px", 
            padding: "5px 10px", 
            fontSize: "0.7rem", 
            borderColor: isLiveSync ? "var(--border-color)" : "rgba(0, 240, 255, 0.25)",
            color: isLiveSync ? "var(--color-text-muted)" : undefined,
            cursor: isLiveSync ? "not-allowed" : "pointer"
          }}
          title="Simula resultados rápidos para todos los partidos"
        >
          <FastForward size={14} style={{ color: isLiveSync ? "var(--color-text-muted)" : "var(--neon-blue)" }} />
          <span>Todo</span>
        </button>

        <button
          onClick={onResetSimulation}
          disabled={isLiveSync}
          className="glass-button"
          style={{ 
            flex: "0 0 32px", 
            padding: "5px", 
            borderColor: isLiveSync ? "var(--border-color)" : undefined,
            color: isLiveSync ? "var(--color-text-muted)" : undefined,
            cursor: isLiveSync ? "not-allowed" : "pointer"
          }}
          title="Reiniciar marcadores a Cero"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Ticker de Eventos Recientes */}
      <div style={{ marginTop: "4px" }}>
        <span style={{ 
          display: "block", 
          fontSize: "0.7rem", 
          color: "var(--color-text-secondary)", 
          marginBottom: "4px",
          fontWeight: 600,
          textTransform: "uppercase"
        }}>
          {isLiveSync ? "Registro de Eventos Oficiales" : "Sucesos en los Estadios"}
        </span>
        <div style={{ 
          background: "rgba(0,0,0,0.2)", 
          borderRadius: "var(--radius-sm)", 
          padding: "6px 8px", 
          height: "100px", 
          overflowY: "auto",
          border: "1px solid var(--border-color)",
          fontSize: "0.75rem",
          display: "flex",
          flexDirection: "column",
          gap: "6px"
        }}>
          {liveEvents.length === 0 ? (
            <div style={{ 
              height: "100%", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              color: "var(--color-text-muted)",
              fontStyle: "italic",
              textAlign: "center"
            }}>
              {isLiveSync 
                ? "Conectando al servidor...\nEsperando eventos oficiales." 
                : "No hay sucesos recientes.\nInicia la simulación."}
            </div>
          ) : (
            [...liveEvents].reverse().map((event, index) => (
              <div 
                key={index} 
                style={{ 
                  padding: "4px 6px", 
                  borderRadius: "2px", 
                  background: "rgba(255,255,255,0.01)", 
                  borderLeft: "2px solid var(--neon-blue)",
                  animation: "fadeIn 0.3s ease-out"
                }}
              >
                {event}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
