
import { ProjectProps } from "../ProjectCard";

export const projects: (ProjectProps & { isFeatured?: boolean })[] = [
  {
    title: "SnakkaZ",
    description: "Sikker samtalekryptering med avansert AI-assistent. Chat med ende-til-ende-kryptering og intelligente svar.",
    previewUrl: "https://www.snakkaz.com",
    category: "chat",
    isFeatured: true,
    hasSupabase: true,
    progress: 98
  },
  {
    title: "AI Dash Hub",
    description: "Interaktivt dashboard for AI-basert datavisualisering og analyse. Integrer flere datakilder og få innsikt i sanntid.",
    previewUrl: "https://dash.snakkaz.com",
    githubUrl: "https://github.com/snakkaz/ai-dash-hub",
    category: "analytics",
    hasSupabase: true,
    progress: 92
  },
  {
    title: "SnakkaZ Guardian Chat",
    description: "En sikker chat-plattform med ende-til-ende-kryptering. Del meldinger, bilder og filer med full sikkerhet.",
    previewUrl: "https://chat.snakkaz.com",
    category: "chat",
    hasSupabase: true,
    progress: 95
  },
  {
    title: "SnakkaZ Business Analyser",
    description: "Visualiser forretningsdata med kraftige analytiske verktøy og dashboards. Tilgjengelig for team på tvers av organisasjoner.",
    previewUrl: "https://business.snakkaz.com",
    githubUrl: "https://github.com/snakkaz/business-analyzer",
    category: "business",
    progress: 78
  },
  {
    title: "SnakkaZ Secure Docs",
    description: "Dokumentsamarbeid med kryptering og avanserte delingsmuligheter. Perfekt for sensitive forretningsdokumenter.",
    previewUrl: "https://docs.snakkaz.com",
    category: "business",
    hasSupabase: true,
    progress: 65
  },
  {
    title: "SnakkaZ Analytics Hub",
    description: "Samle alle dine datakilder på ett sted for helhetlig analyse og innsikt. Støtter integrering med mange tredjepartstjenester.",
    previewUrl: "https://analytics.snakkaz.com",
    githubUrl: "https://github.com/snakkaz/analytics-hub",
    category: "analytics",
    progress: 82
  }
];
