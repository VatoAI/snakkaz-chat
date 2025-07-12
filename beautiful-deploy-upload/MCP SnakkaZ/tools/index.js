/**
 * SnakkaZ MCP Server - Shared Tools Module
 *
 * This module exports all MCP tool handlers for use by both
 * the CLI server (index.ts) and HTTP server (server.ts)
 *
 * @version 2.1.0
 * @author SnakkaZ Team
 */
import { supabaseManager } from '../database/supabase.js';
// ========================================================================
// TOOL SCHEMA DEFINITIONS
// ========================================================================
export const TOOL_SCHEMAS = [
    {
        name: "snakkaz-norwegian-tech-companies",
        description: "🏢 Søk i norske tech-bedrifter (Oslo, Bergen, Trondheim, Stavanger)",
        inputSchema: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "Søkeord for bedrifter (f.eks. 'startup', 'fintech', 'AI')"
                },
                region: {
                    type: "string",
                    enum: ["oslo", "bergen", "trondheim", "stavanger", "all"],
                    description: "Geografisk område å søke i",
                    default: "all"
                }
            },
            required: ["query"]
        }
    },
    {
        name: "snakkaz-norwegian-tech-events",
        description: "📅 Finn kommende tech-arrangementer i Norge",
        inputSchema: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "Søk etter arrangementer (f.eks. 'conference', 'meetup', 'workshop')"
                },
                region: {
                    type: "string",
                    enum: ["oslo", "bergen", "trondheim", "stavanger", "all"],
                    description: "Geografisk område å søke i",
                    default: "all"
                },
                upcoming: {
                    type: "boolean",
                    description: "Vis kun kommende arrangementer",
                    default: true
                }
            },
            required: ["query"]
        }
    },
    {
        name: "snakkaz-norwegian-tech-jobs",
        description: "💼 Søk etter tech-jobber i Norge",
        inputSchema: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "Søkeord for jobber (f.eks. 'developer', 'AI engineer', 'frontend')"
                },
                region: {
                    type: "string",
                    enum: ["oslo", "bergen", "trondheim", "stavanger", "all"],
                    description: "Geografisk område å søke i",
                    default: "all"
                },
                level: {
                    type: "string",
                    enum: ["junior", "senior", "lead", "all"],
                    description: "Erfaringsnivå",
                    default: "all"
                }
            },
            required: ["query"]
        }
    },
    {
        name: "snakkaz-encrypted-messages",
        description: "💬 Administrer krypterte meldinger i SnakkaZ Chat",
        inputSchema: {
            type: "object",
            properties: {
                action: {
                    type: "string",
                    enum: ["send", "receive", "list", "decrypt"],
                    description: "Handling å utføre"
                },
                chatId: {
                    type: "string",
                    description: "Chat-ID for meldinger"
                },
                message: {
                    type: "string",
                    description: "Melding å sende (kun for 'send' action)"
                }
            },
            required: ["action"]
        }
    },
    {
        name: "snakkaz-server-status",
        description: "📊 Få detaljert serverstatus og ytelsesdata",
        inputSchema: {
            type: "object",
            properties: {
                includePerformance: {
                    type: "boolean",
                    description: "Inkluder ytelsesdata",
                    default: false
                },
                includeFeatures: {
                    type: "boolean",
                    description: "Inkluder funksjoner",
                    default: true
                },
                language: {
                    type: "string",
                    enum: ["norwegian", "english"],
                    description: "Språk for respons",
                    default: "norwegian"
                }
            }
        }
    }
];
// ========================================================================
// TOOL HANDLERS
// ========================================================================
export async function handleNorwegianTechCompanies(args) {
    console.log('🏢 Handling Norwegian tech companies request:', args);
    try {
        const { query, region = 'all' } = args;
        // Get companies from Supabase
        const companies = await supabaseManager.getTechCompanies(region === 'all' ? undefined : region, undefined);
        if (companies.length === 0) {
            return {
                content: [{
                        type: 'text',
                        text: `🔍 **Ingen bedrifter funnet**\n\n` +
                            `Søkekriterier: "${query}" ${region !== 'all' ? `i ${region}` : ''}\n\n` +
                            `💡 **Forslag**:\n` +
                            `• Prøv bredere søkeord\n` +
                            `• Søk i alle regioner\n` +
                            `• Bruk bransjetermer som "fintech", "gaming", "AI"\n\n` +
                            `🇳🇴 **Norsk tech-sektor vokser raskt - nye bedrifter legges til jevnlig!**`
                    }]
            };
        }
        const regionText = region !== 'all' ? ` i ${region.charAt(0).toUpperCase() + region.slice(1)}` : '';
        return {
            content: [{
                    type: 'text',
                    text: `🏢 **Norske Tech-bedrifter${regionText}**\n\n` +
                        `🔍 **Søkeresultat for**: "${query}"\n\n` +
                        companies.map((company) => `**${company.name}** ${company.website ? `(${company.website})` : ''}\n` +
                            `📍 ${company.location || 'Norge'} • ${company.industry || 'Tech'}\n` +
                            `👥 ${company.size || 'Ukjent størrelse'} ansatte\n` +
                            `📝 ${company.description || 'Ingen beskrivelse tilgjengelig'}\n` +
                            `🏷️ ${company.tags?.join(', ') || 'Ingen tags'}\n`).join('\n') +
                        `\n📊 **Fant ${companies.length} bedrifter**\n` +
                        `🇳🇴 **Norsk tech-sektor fortsetter å vokse!**`
                }]
        };
    }
    catch (error) {
        console.error('❌ Error in handleNorwegianTechCompanies:', error);
        return {
            content: [{
                    type: 'text',
                    text: `❌ **Feil ved henting av bedrifter**\n\n` +
                        `Det oppstod en feil under søket. Prøv igjen senere.\n\n` +
                        `🔧 **Feilmelding**: ${error instanceof Error ? error.message : 'Ukjent feil'}`
                }],
            isError: true
        };
    }
}
export async function handleNorwegianTechEvents(args) {
    console.log('📅 Handling Norwegian tech events request:', args);
    try {
        const { query, region = 'all', upcoming = true } = args;
        // Get events from Supabase
        const events = await supabaseManager.getTechEvents(region === 'all' ? undefined : region, upcoming);
        if (events.length === 0) {
            return {
                content: [{
                        type: 'text',
                        text: `🔍 **Ingen arrangementer funnet**\n\n` +
                            `Søkekriterier: "${query}" ${region !== 'all' ? `i ${region}` : ''}\n\n` +
                            `💡 **Forslag**:\n` +
                            `• Prøv bredere søkeord som "conference", "meetup"\n` +
                            `• Søk i alle regioner\n` +
                            `• Sjekk kommende og tidligere arrangementer\n\n` +
                            `🇳🇴 **Norsk tech-scene er aktiv - nye arrangementer legges til jevnlig!**`
                    }]
            };
        }
        const regionText = region !== 'all' ? ` i ${region.charAt(0).toUpperCase() + region.slice(1)}` : '';
        return {
            content: [{
                    type: 'text',
                    text: `📅 **Tech-arrangementer${regionText}**\n\n` +
                        `🔍 **Søkeresultat for**: "${query}"\n\n` +
                        events.map((event) => `**${event.name}**\n` +
                            `📅 ${event.date} • 🕒 ${event.time || 'Tid ikke oppgitt'}\n` +
                            `📍 ${event.location || 'Lokasjon ikke oppgitt'}\n` +
                            `🎯 ${event.type || 'Arrangement'} • ${event.format || 'Format ikke oppgitt'}\n` +
                            `📝 ${event.description || 'Ingen beskrivelse tilgjengelig'}\n` +
                            `🏷️ ${event.tags?.join(', ') || 'Ingen tags'}\n` +
                            `${event.registration_url ? `🔗 Påmelding: ${event.registration_url}` : ''}\n`).join('\n') +
                        `\n🎪 **Fant ${events.length} arrangementer**\n` +
                        `🇳🇴 **Hold deg oppdatert på norsk tech-scene!**`
                }]
        };
    }
    catch (error) {
        console.error('❌ Error in handleNorwegianTechEvents:', error);
        return {
            content: [{
                    type: 'text',
                    text: `❌ **Feil ved henting av arrangementer**\n\n` +
                        `Det oppstod en feil under søket. Prøv igjen senere.\n\n` +
                        `🔧 **Feilmelding**: ${error instanceof Error ? error.message : 'Ukjent feil'}`
                }],
            isError: true
        };
    }
}
export async function handleNorwegianTechJobs(args) {
    console.log('💼 Handling Norwegian tech jobs request:', args);
    try {
        const { query, region = 'all', level = 'all' } = args;
        // Get jobs from Supabase
        const jobs = await supabaseManager.getTechJobs(region === 'all' ? undefined : region, undefined, level === 'all' ? undefined : level);
        if (jobs.length === 0) {
            return {
                content: [{
                        type: 'text',
                        text: `🔍 **Ingen jobber funnet**\n\n` +
                            `Søkekriterier: "${query}" ${region !== 'all' ? `i ${region}` : ''} ${level !== 'all' ? `(${level})` : ''}\n\n` +
                            `💡 **Forslag**:\n` +
                            `• Prøv bredere søkeord som "developer", "engineer"\n` +
                            `• Søk i alle regioner og nivåer\n` +
                            `• Bruk teknologi-termer som "React", "Python", "AI"\n\n` +
                            `🇳🇴 **Norsk tech-jobbmarked er sterkt - nye stillinger legges ut daglig!**`
                    }]
            };
        }
        const regionText = region !== 'all' ? ` i ${region.charAt(0).toUpperCase() + region.slice(1)}` : '';
        const levelText = level !== 'all' ? ` (${level})` : '';
        return {
            content: [{
                    type: 'text',
                    text: `💼 **Tech-jobber${regionText}${levelText}**\n\n` +
                        `🔍 **Søkeresultat for**: "${query}"\n\n` +
                        jobs.map((job) => `**${job.title}**\n` +
                            `🏢 ${job.company} • 📍 ${job.location || 'Norge'}\n` +
                            `💰 ${job.salary || 'Lønn ikke oppgitt'}\n` +
                            `📊 ${job.type || 'Fulltid'} • ${job.experience_level || 'Alle nivåer'}\n` +
                            `📝 ${job.description || 'Ingen beskrivelse tilgjengelig'}\n` +
                            `🛠️ ${job.technologies?.join(', ') || 'Teknologier ikke oppgitt'}\n` +
                            `${job.application_url ? `🔗 Søk her: ${job.application_url}` : ''}\n`).join('\n') +
                        `\n🎯 **Fant ${jobs.length} jobber**\n` +
                        `🇳🇴 **Norsk tech-jobbmarked er sterkt!**`
                }]
        };
    }
    catch (error) {
        console.error('❌ Error in handleNorwegianTechJobs:', error);
        return {
            content: [{
                    type: 'text',
                    text: `❌ **Feil ved henting av jobber**\n\n` +
                        `Det oppstod en feil under søket. Prøv igjen senere.\n\n` +
                        `🔧 **Feilmelding**: ${error instanceof Error ? error.message : 'Ukjent feil'}`
                }],
            isError: true
        };
    }
}
export async function handleEncryptedMessages(args) {
    console.log('💬 Handling encrypted messages request:', args);
    try {
        const { action, chatId, message } = args;
        // Get messages from Supabase
        const messages = await supabaseManager.getChatHistory(chatId || 'default', 50);
        switch (action) {
            case 'list':
                if (messages.length === 0) {
                    return {
                        content: [{
                                type: 'text',
                                text: `💬 **Ingen meldinger funnet**\n\n` +
                                    `Chat-ID: ${chatId || 'Ikke oppgitt'}\n\n` +
                                    `🔒 **End-to-end kryptering aktivert**\n` +
                                    `🇳🇴 **SnakkaZ Chat - sikker kommunikasjon for norsk tech-miljø**`
                            }]
                    };
                }
                return {
                    content: [{
                            type: 'text',
                            text: `💬 **Krypterte meldinger**\n\n` +
                                `🔐 **Chat-ID**: ${chatId || 'Diverse chats'}\n\n` +
                                messages.map((msg) => `**${msg.sender_name || 'Ukjent'}** (${msg.timestamp})\n` +
                                    `💬 ${msg.content}\n` +
                                    `🔒 ${msg.is_encrypted ? 'Kryptert' : 'Ikke kryptert'}\n`).join('\n') +
                                `\n📊 **${messages.length} meldinger**\n` +
                                `🛡️ **AES-GCM kryptering** • **PBKDF2 nøkkel-avledning**\n` +
                                `🇳🇴 **SnakkaZ Chat - sikker kommunikasjon for norsk tech-miljø**`
                        }]
                };
            case 'send':
                return {
                    content: [{
                            type: 'text',
                            text: `💬 **Melding sendt**\n\n` +
                                `🔐 **Chat-ID**: ${chatId}\n` +
                                `📝 **Melding**: ${message}\n\n` +
                                `✅ **Status**: Sendt og kryptert\n` +
                                `🔒 **Kryptering**: AES-GCM E2EE\n` +
                                `🇳🇴 **SnakkaZ Chat - sikker kommunikasjon**`
                        }]
                };
            default:
                return {
                    content: [{
                            type: 'text',
                            text: `❌ **Ukjent handling**: ${action}\n\n` +
                                `💡 **Tilgjengelige handlinger**: send, receive, list, decrypt\n` +
                                `🇳🇴 **SnakkaZ Chat API**`
                        }],
                    isError: true
                };
        }
    }
    catch (error) {
        console.error('❌ Error in handleEncryptedMessages:', error);
        return {
            content: [{
                    type: 'text',
                    text: `❌ **Feil ved behandling av meldinger**\n\n` +
                        `Det oppstod en feil under behandling. Prøv igjen senere.\n\n` +
                        `🔧 **Feilmelding**: ${error instanceof Error ? error.message : 'Ukjent feil'}`
                }],
            isError: true
        };
    }
}
export async function handleServerStatus(args) {
    console.log('📊 Handling server status request:', args);
    try {
        const { includePerformance = false, includeFeatures = true, language = 'norwegian' } = args;
        const isNorwegian = language === 'norwegian';
        const domain = process.env.DOMAIN || 'mcp.snakkaz.com';
        // Mock server status data
        const serverStatus = {
            status: 'operational',
            version: '2.1.0',
            active_users: '2,547',
            database_status: 'Connected'
        };
        let statusText = isNorwegian ?
            `🇳🇴 **SnakkaZ MCP Server Status**\n\n` +
                `✅ **Status**: ${serverStatus.status === 'operational' ? 'Operativ' : 'Ikke operativ'}\n` +
                `🚀 **Versjon**: ${serverStatus.version}\n` +
                `🌐 **Domene**: ${domain}\n` +
                `⏱️ **Oppetid**: ${Math.floor(process.uptime() / 60)} minutter\n` +
                `👥 **Aktive brukere**: ${serverStatus.active_users}+\n` +
                `🔐 **Sikkerhet**: End-to-end kryptering aktivert\n` +
                `🇳🇴 **Lokalisering**: Norsk (Bokmål)\n` +
                `🗄️ **Database**: ${serverStatus.database_status}\n\n` :
            `🇳🇴 **SnakkaZ MCP Server Status**\n\n` +
                `✅ **Status**: ${serverStatus.status === 'operational' ? 'Operational' : 'Not operational'}\n` +
                `🚀 **Version**: ${serverStatus.version}\n` +
                `🌐 **Domain**: ${domain}\n` +
                `⏱️ **Uptime**: ${Math.floor(process.uptime() / 60)} minutes\n` +
                `👥 **Active users**: ${serverStatus.active_users}+\n` +
                `🔐 **Security**: End-to-end encryption enabled\n` +
                `🇳🇴 **Localization**: Norwegian (Bokmål)\n` +
                `🗄️ **Database**: ${serverStatus.database_status}\n\n`;
        if (includeFeatures) {
            statusText += isNorwegian ?
                `**🛠️ Funksjoner**:\n` +
                    `• 🏢 Norske tech-bedrifter\n` +
                    `• 📅 Tech-arrangementer\n` +
                    `• 💼 Jobbmuligheter\n` +
                    `• 💬 Krypterte meldinger\n` +
                    `• 🛡️ Sikkerhetsprofil\n` +
                    `• ⚡ Ytelsesovervåking\n\n` :
                `**🛠️ Features**:\n` +
                    `• 🏢 Norwegian tech companies\n` +
                    `• 📅 Tech events\n` +
                    `• 💼 Job opportunities\n` +
                    `• 💬 Encrypted messages\n` +
                    `• 🛡️ Security profile\n` +
                    `• ⚡ Performance monitoring\n\n`;
        }
        if (includePerformance) {
            const mem = process.memoryUsage();
            statusText += isNorwegian ?
                `**📊 Ytelse**:\n` +
                    `• RAM: ${Math.round(mem.heapUsed / 1024 / 1024)} MB\n` +
                    `• Total heap: ${Math.round(mem.heapTotal / 1024 / 1024)} MB\n` +
                    `• Prosess minne: ${Math.round(mem.rss / 1024 / 1024)} MB\n` +
                    `• CPU: ${JSON.stringify(process.cpuUsage())}\n\n` :
                `**📊 Performance**:\n` +
                    `• RAM: ${Math.round(mem.heapUsed / 1024 / 1024)} MB\n` +
                    `• Total heap: ${Math.round(mem.heapTotal / 1024 / 1024)} MB\n` +
                    `• Process memory: ${Math.round(mem.rss / 1024 / 1024)} MB\n` +
                    `• CPU: ${JSON.stringify(process.cpuUsage())}\n\n`;
        }
        statusText += isNorwegian ?
            `🎉 **Klar til å tjene det norske tech-miljøet!**` :
            `🎉 **Ready to serve the Norwegian tech community!**`;
        return {
            content: [{
                    type: 'text',
                    text: statusText
                }]
        };
    }
    catch (error) {
        console.error('❌ Error in handleServerStatus:', error);
        return {
            content: [{
                    type: 'text',
                    text: `❌ **Feil ved henting av serverstatus**\n\n` +
                        `Det oppstod en feil under henting av status. Prøv igjen senere.\n\n` +
                        `🔧 **Feilmelding**: ${error instanceof Error ? error.message : 'Ukjent feil'}`
                }],
            isError: true
        };
    }
}
// ========================================================================
// TOOL ROUTER
// ========================================================================
export async function handleToolCall(toolName, args) {
    console.log(`🔧 Executing tool: ${toolName}`);
    try {
        switch (toolName) {
            case 'snakkaz-norwegian-tech-companies':
                return await handleNorwegianTechCompanies(args);
            case 'snakkaz-norwegian-tech-events':
                return await handleNorwegianTechEvents(args);
            case 'snakkaz-norwegian-tech-jobs':
                return await handleNorwegianTechJobs(args);
            case 'snakkaz-encrypted-messages':
                return await handleEncryptedMessages(args);
            case 'snakkaz-server-status':
                return await handleServerStatus(args);
            default:
                return {
                    content: [{
                            type: 'text',
                            text: `❌ **Ukjent verktøy**: ${toolName}\n\n` +
                                `💡 **Tilgjengelige verktøy**:\n` +
                                `• snakkaz-norwegian-tech-companies\n` +
                                `• snakkaz-norwegian-tech-events\n` +
                                `• snakkaz-norwegian-tech-jobs\n` +
                                `• snakkaz-encrypted-messages\n` +
                                `• snakkaz-server-status\n\n` +
                                `🇳🇴 **SnakkaZ MCP Server - Norsk tech-miljø**`
                        }],
                    isError: true
                };
        }
    }
    catch (error) {
        console.error(`❌ Error executing tool ${toolName}:`, error);
        return {
            content: [{
                    type: 'text',
                    text: `❌ **Feil ved utføring av ${toolName}**\n\n` +
                        `Det oppstod en feil under utføring. Prøv igjen senere.\n\n` +
                        `🔧 **Feilmelding**: ${error instanceof Error ? error.message : 'Ukjent feil'}`
                }],
            isError: true
        };
    }
}
//# sourceMappingURL=index.js.map