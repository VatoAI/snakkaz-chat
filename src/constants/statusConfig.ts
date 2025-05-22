// Status Icons and Labels for User Presence
import { Circle, Clock, Loader2, Moon, EyeOff } from "lucide-react";

export const statusIcons = {
  online: Circle,
  busy: Clock,
  brb: Loader2,
  away: Moon,
  offline: Circle,
  invisible: EyeOff
};

export const statusLabels = {
  online: "Online",
  busy: "Opptatt",
  brb: "BRB",
  away: "Borte",
  offline: "Offline",
  invisible: "Usynlig"
};
