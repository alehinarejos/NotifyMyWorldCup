import type { MatchWithDetails } from "../data/matches";

/**
 * Genera y descarga un archivo .ics para el partido con un recordatorio opcional.
 */
export const downloadICSFile = (match: MatchWithDetails, reminderOffsetMinutes: number): void => {
  const startDate = new Date(match.date);
  const endDate = new Date(startDate.getTime() + 105 * 60 * 1000); // 105 minutos (90 min + entretiempo + añadido)

  const formatICSDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  const title = `🏆 ${match.homeTeam.name} vs ${match.awayTeam.name} | Mundial FIFA 2026`;
  const description = `Fase de grupos - Grupo ${match.group}\\nEstadio: ${match.stadium.name}, ${match.stadium.city}, ${match.stadium.country}\\n\\nRecordatorio configurado para ${reminderOffsetMinutes} minutos antes del partido.`;
  const location = `${match.stadium.name}, ${match.stadium.city}, ${match.stadium.country}`;

  let alarmSection = "";
  if (reminderOffsetMinutes > 0) {
    alarmSection = `
BEGIN:VALARM
TRIGGER:-PT${reminderOffsetMinutes}M
ACTION:DISPLAY
DESCRIPTION:Recordatorio: ¡${match.homeTeam.name} vs ${match.awayTeam.name} comienza en ${reminderOffsetMinutes} minutos!
END:VALARM`;
  } else if (reminderOffsetMinutes === 0) {
    alarmSection = `
BEGIN:VALARM
TRIGGER:PT0M
ACTION:DISPLAY
DESCRIPTION:Recordatorio: ¡Empieza el partido ${match.homeTeam.name} vs ${match.awayTeam.name}!
END:VALARM`;
  }

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Notify My World Cup 2026//ES
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:wc2026-match-${match.id}@notifymyworldcup.com
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(startDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
STATUS:CONFIRMED
SEQUENCE:0
TRANSP:OPAQUE${alarmSection}
END:VEVENT
END:VCALENDAR`.trim();

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `Mundial2026_${match.homeTeam.code}_vs_${match.awayTeam.code}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Genera la URL de Google Calendar para añadir el evento.
 */
export const getGoogleCalendarUrl = (match: MatchWithDetails): string => {
  const startDate = new Date(match.date);
  const endDate = new Date(startDate.getTime() + 105 * 60 * 1000);

  const formatGoogleDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  const text = encodeURIComponent(`🏆 ${match.homeTeam.name} vs ${match.awayTeam.name} | Mundial FIFA 2026`);
  const dates = `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`;
  const details = encodeURIComponent(
    `Partido de la fase de grupos - Grupo ${match.group}.\nEstadio: ${match.stadium.name}, ${match.stadium.city}, ${match.stadium.country}.\n\n¡Creado desde Notify My World Cup 2026!`
  );
  const location = encodeURIComponent(`${match.stadium.name}, ${match.stadium.city}, ${match.stadium.country}`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}`;
};
