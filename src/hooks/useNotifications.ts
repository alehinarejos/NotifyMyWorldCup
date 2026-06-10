import { useState, useEffect, useCallback } from "react";

export interface ScheduledReminder {
  matchId: string;
  matchDate: string; // ISO string
  homeTeam: string;
  awayTeam: string;
  offsetMinutes: number; // minutes before match
  scheduledTime: number; // timestamp in ms when reminder should fire
  triggered: boolean;
}

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [reminders, setReminders] = useState<ScheduledReminder[]>([]);

  // Cargar estado inicial
  useEffect(() => {
    if (typeof window !== "undefined") {
      setPermission(Notification.permission);
      const saved = localStorage.getItem("wc2026_reminders");
      if (saved) {
        try {
          setReminders(JSON.parse(saved));
        } catch (e) {
          console.error("Error parsing saved reminders", e);
        }
      }
    }
  }, []);

  // Guardar recordatorios en localStorage al cambiar
  const saveReminders = useCallback((updated: ScheduledReminder[]) => {
    setReminders(updated);
    localStorage.setItem("wc2026_reminders", JSON.stringify(updated));
  }, []);

  // Solicitar permiso de notificaciones
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!("Notification" in window)) {
      alert("Este navegador no soporta notificaciones de escritorio.");
      return false;
    }

    const res = await Notification.requestPermission();
    setPermission(res);
    return res === "granted";
  }, []);

  // Programar recordatorio
  const scheduleReminder = useCallback((
    matchId: string,
    matchDateStr: string,
    homeTeam: string,
    awayTeam: string,
    offsetMinutes: number
  ) => {
    const matchTime = new Date(matchDateStr).getTime();
    const scheduledTime = matchTime - offsetMinutes * 60 * 1000;

    // Si la fecha programada ya pasó, no se programa
    if (scheduledTime <= Date.now()) {
      alert("La hora del recordatorio ya ha pasado. Por favor selecciona otro tiempo.");
      return;
    }

    // Filtrar recordatorio anterior para el mismo partido si existe
    const filtered = reminders.filter(r => r.matchId !== matchId);

    const newReminder: ScheduledReminder = {
      matchId,
      matchDate: matchDateStr,
      homeTeam,
      awayTeam,
      offsetMinutes,
      scheduledTime,
      triggered: false
    };

    saveReminders([...filtered, newReminder]);
  }, [reminders, saveReminders]);

  // Cancelar recordatorio
  const removeReminder = useCallback((matchId: string) => {
    const updated = reminders.filter(r => r.matchId !== matchId);
    saveReminders(updated);
  }, [reminders, saveReminders]);

  // Verificar si hay recordatorio programado
  const hasReminder = useCallback((matchId: string): boolean => {
    return reminders.some(r => r.matchId === matchId && !r.triggered);
  }, [reminders]);

  // Obtener antelación del recordatorio
  const getReminderOffset = useCallback((matchId: string): number | null => {
    const found = reminders.find(r => r.matchId === matchId && !r.triggered);
    return found ? found.offsetMinutes : null;
  }, [reminders]);

  // Monitoreo y disparo de notificaciones
  useEffect(() => {
    const checkReminders = () => {
      const now = Date.now();
      let changed = false;
      const updated = reminders.map(reminder => {
        // Disparar si ya es hora y no se ha disparado aún
        if (!reminder.triggered && now >= reminder.scheduledTime) {
          changed = true;
          
          if (Notification.permission === "granted") {
            const timeText = reminder.offsetMinutes === 0 
              ? "¡Comienza el partido!" 
              : `comienza en ${reminder.offsetMinutes} minutos.`;
            
            new Notification(`🏆 Alerta de Partido: Mundial 2026`, {
              body: `El partido entre ${reminder.homeTeam} y ${reminder.awayTeam} ${timeText}`,
              icon: "https://flagcdn.com/w80/us.png", // Usamos la de US como por defecto del mundial
              tag: `match-${reminder.matchId}`
            });
          } else {
            console.log(`[Notification Sim] ${reminder.homeTeam} vs ${reminder.awayTeam} está por comenzar!`);
          }
          
          return { ...reminder, triggered: true };
        }
        return reminder;
      });

      if (changed) {
        saveReminders(updated);
      }
    };

    // Verificar cada 10 segundos
    const timer = setInterval(checkReminders, 10000);
    // Verificar inmediatamente al cargar
    checkReminders();

    return () => clearInterval(timer);
  }, [reminders, saveReminders]);

  return {
    permission,
    requestPermission,
    scheduleReminder,
    removeReminder,
    hasReminder,
    getReminderOffset,
    reminders
  };
};
