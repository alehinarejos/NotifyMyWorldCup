import React, { useState } from "react";
import { X, Bell, Download, ExternalLink } from "lucide-react";
import type { MatchWithDetails } from "../data/matches";
import { downloadICSFile, getGoogleCalendarUrl } from "../utils/calendar";

interface CalendarModalProps {
  match: MatchWithDetails;
  onClose: () => void;
  hasReminder: boolean;
  reminderOffset: number | null;
  onScheduleReminder: (offset: number) => void;
  onRemoveReminder: () => void;
  permission: NotificationPermission;
  onRequestPermission: () => Promise<boolean>;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({
  match,
  onClose,
  hasReminder,
  reminderOffset,
  onScheduleReminder,
  onRemoveReminder,
  permission,
  onRequestPermission
}) => {
  const [selectedOffset, setSelectedOffset] = useState<number>(reminderOffset !== null ? reminderOffset : 15);

  const offsets = [
    { value: 0, label: "Al inicio del partido" },
    { value: 15, label: "15 minutos antes" },
    { value: 30, label: "30 minutos antes" },
    { value: 60, label: "1 hora antes" },
    { value: 120, label: "2 horas antes" },
    { value: 1440, label: "1 día antes" }
  ];

  const handleDownloadICS = () => {
    downloadICSFile(match, selectedOffset);
  };

  const handleGoogleCalendar = () => {
    const url = getGoogleCalendarUrl(match);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleToggleWebNotification = async () => {
    if (hasReminder) {
      onRemoveReminder();
    } else {
      let isGranted = permission === "granted";
      if (permission === "default") {
        isGranted = await onRequestPermission();
      } else if (permission === "denied") {
        alert(
          "Has denegado los permisos de notificación. Habilítalos en la configuración de tu navegador para usar esta función."
        );
        return;
      }

      if (isGranted) {
        onScheduleReminder(selectedOffset);
      }
    }
  };

  // Convertir fecha UTC a local para el usuario
  const localDate = new Date(match.date).toLocaleString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(3, 5, 12, 0.75)",
      backdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px"
    }} onClick={onClose}>
      <div 
        className="glass-panel" 
        style={{
          width: "100%",
          maxWidth: "500px",
          padding: "28px",
          position: "relative",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6)",
          display: "flex",
          flexDirection: "column",
          gap: "24px"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button 
          onClick={onClose} 
          className="glass-button" 
          style={{ 
            position: "absolute", 
            top: "20px", 
            right: "20px", 
            padding: "8px", 
            borderRadius: "50%" 
          }}
        >
          <X size={18} />
        </button>

        {/* Encabezado */}
        <div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "4px" }}>
            Añadir Partido al Calendario
          </h2>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem" }}>
            Mundial de la FIFA 2026 - Grupo {match.group}
          </p>
        </div>

        {/* Info Partido */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          padding: "16px",
          background: "rgba(255, 255, 255, 0.02)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-glass)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", justifyContent: "center", width: "100%" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", width: "40%" }}>
              <img 
                src={match.homeTeam.flagUrl} 
                alt={`Bandera de ${match.homeTeam.name}`} 
                className="wc-flag-md" 
              />
              <span style={{ fontWeight: 600, fontSize: "0.95rem", textAlign: "center" }}>
                {match.homeTeam.name}
              </span>
            </div>
            <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-text-muted)" }}>VS</span>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", width: "40%" }}>
              <img 
                src={match.awayTeam.flagUrl} 
                alt={`Bandera de ${match.awayTeam.name}`} 
                className="wc-flag-md" 
              />
              <span style={{ fontWeight: 600, fontSize: "0.95rem", textAlign: "center" }}>
                {match.awayTeam.name}
              </span>
            </div>
          </div>
          
          <div style={{ 
            fontSize: "0.85rem", 
            color: "var(--neon-blue)", 
            textAlign: "center", 
            marginTop: "6px",
            fontFamily: "var(--font-secondary)"
          }}>
            {localDate}
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
            📍 {match.stadium.name} ({match.stadium.city})
          </div>
        </div>

        {/* Selección de Recordatorio */}
        <div>
          <label style={{ 
            display: "block", 
            fontSize: "0.85rem", 
            fontWeight: 600, 
            color: "var(--color-text-secondary)",
            marginBottom: "10px",
            textTransform: "uppercase"
          }}>
            ¿Con cuánta antelación quieres el recordatorio?
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {offsets.map((o) => (
              <button
                key={o.value}
                onClick={() => setSelectedOffset(o.value)}
                className="glass-button"
                style={{
                  padding: "10px",
                  fontSize: "0.85rem",
                  textAlign: "left",
                  justifyContent: "flex-start",
                  borderColor: selectedOffset === o.value ? "var(--neon-blue)" : "var(--border-glass)",
                  background: selectedOffset === o.value ? "rgba(0, 240, 255, 0.08)" : "rgba(255, 255, 255, 0.02)",
                  color: selectedOffset === o.value ? "var(--neon-blue)" : "var(--color-text-primary)"
                }}
              >
                <div style={{ 
                  width: "6px", 
                  height: "6px", 
                  borderRadius: "50%", 
                  background: selectedOffset === o.value ? "var(--neon-blue)" : "transparent",
                  marginRight: "8px",
                  border: selectedOffset === o.value ? "none" : "1px solid var(--color-text-muted)"
                }} />
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Acciones del Calendario */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
          
          {/* Alertas del Navegador */}
          <button
            onClick={handleToggleWebNotification}
            className={`glass-button ${hasReminder ? "active" : ""}`}
            style={{ 
              width: "100%", 
              justifyContent: "space-between", 
              background: hasReminder ? undefined : "rgba(139, 92, 246, 0.1)",
              borderColor: hasReminder ? undefined : "rgba(139, 92, 246, 0.2)"
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Bell size={18} style={{ color: hasReminder ? "#fff" : "var(--neon-purple)" }} />
              {hasReminder 
                ? `Alerta Activa (${reminderOffset === 0 ? "Al inicio" : `${reminderOffset} min antes`})` 
                : "Recordarme en esta pestaña"
              }
            </span>
            <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>
              {hasReminder ? "Desactivar" : "Activar Alerta"}
            </span>
          </button>

          {/* Descarga ICS */}
          <button
            onClick={handleDownloadICS}
            className="glass-button"
            style={{ width: "100%", justifyContent: "flex-start", gap: "10px" }}
          >
            <Download size={18} style={{ color: "var(--neon-green)" }} />
            Descargar archivo .ics (iCal / Outlook)
          </button>

          {/* Google Calendar */}
          <button
            onClick={handleGoogleCalendar}
            className="glass-button"
            style={{ width: "100%", justifyContent: "flex-start", gap: "10px" }}
          >
            <ExternalLink size={18} style={{ color: "var(--neon-blue)" }} />
            Añadir a Google Calendar
          </button>
        </div>
      </div>
    </div>
  );
};
