#!/bin/bash
# SnakkaZ Beta Launch - Dagens Logg System
# Automatisk loggføring av alle oppgaver og milepæler

LOG_FILE="/tmp/snakkaz-beta-launch-$(date +%Y%m%d).log"
PROGRESS_FILE="/tmp/snakkaz-progress-$(date +%Y%m%d).json"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Initialize progress tracking
init_progress() {
    cat > "$PROGRESS_FILE" << EOF
{
  "date": "$(date)",
  "phases": {
    "deployment": {"completed": false, "start_time": null, "end_time": null, "tasks": []},
    "beta_prep": {"completed": false, "start_time": null, "end_time": null, "tasks": []},
    "soft_launch": {"completed": false, "start_time": null, "end_time": null, "tasks": []},
    "optimization": {"completed": false, "start_time": null, "end_time": null, "tasks": []}
  },
  "metrics": {
    "beta_users": 0,
    "discord_members": 0,
    "messages_sent": 0,
    "errors_detected": 0,
    "performance_score": 0
  }
}
EOF
    echo "$(date): Progress tracking initialized" >> "$LOG_FILE"
}

# Logging function
log_task() {
    local phase="$1"
    local task="$2"
    local status="$3"
    local details="$4"
    
    local timestamp=$(date '+%H:%M:%S')
    local log_entry="[$timestamp] $phase: $task - $status"
    
    if [ -n "$details" ]; then
        log_entry="$log_entry ($details)"
    fi
    
    echo -e "$log_entry" | tee -a "$LOG_FILE"
    
    # Color-coded console output
    case "$status" in
        "STARTED") echo -e "${BLUE}🚀 $task started${NC}" ;;
        "COMPLETED") echo -e "${GREEN}✅ $task completed${NC}" ;;
        "FAILED") echo -e "${RED}❌ $task failed${NC}" ;;
        "IN_PROGRESS") echo -e "${YELLOW}🔄 $task in progress${NC}" ;;
        *) echo -e "${PURPLE}📝 $task: $status${NC}" ;;
    esac
}

# Start phase tracking
start_phase() {
    local phase="$1"
    log_task "$phase" "PHASE_START" "STARTED" "Beginning $phase phase"
    echo -e "\n${CYAN}=== STARTING PHASE: $phase ===${NC}\n"
}

# Complete phase tracking
complete_phase() {
    local phase="$1"
    log_task "$phase" "PHASE_COMPLETE" "COMPLETED" "Phase $phase finished successfully"
    echo -e "\n${GREEN}=== PHASE COMPLETED: $phase ===${NC}\n"
}

# Update metrics
update_metric() {
    local metric="$1"
    local value="$2"
    log_task "METRICS" "$metric" "UPDATED" "New value: $value"
}

# Show current progress
show_progress() {
    echo -e "\n${CYAN}📊 DAGENS PROGRESS OVERSIKT${NC}"
    echo -e "${BLUE}=================================${NC}"
    
    echo -e "\n${YELLOW}📝 Log fil: ${LOG_FILE}${NC}"
    echo -e "${YELLOW}📊 Progress fil: ${PROGRESS_FILE}${NC}"
    
    echo -e "\n${PURPLE}🕐 Dagens Tidslinje:${NC}"
    if [ -f "$LOG_FILE" ]; then
        tail -20 "$LOG_FILE" | while read line; do
            echo -e "  $line"
        done
    fi
    
    echo -e "\n${GREEN}✅ Neste Steg:${NC}"
    echo -e "1. Kjør: start_phase 'DEPLOYMENT'"
    echo -e "2. Utfør oppgave og logg: log_task 'DEPLOYMENT' 'Upload production' 'COMPLETED'"
    echo -e "3. Avslutt fase: complete_phase 'DEPLOYMENT'"
}

# Deployment phase tasks
deployment_checklist() {
    echo -e "${CYAN}📋 DEPLOYMENT FASE SJEKKLISTE${NC}"
    echo -e "1. Upload production package til cPanel"
    echo -e "2. Pakk ut filer til public_html"
    echo -e "3. Test www.snakkaz.com loading"
    echo -e "4. Verifiser liquid glass design"
    echo -e "5. Test PWA install functionality"
    echo -e "6. Kjør emergency debug suite"
    echo -e "7. Verifiser E2EE chat functionality"
}

# Beta prep phase tasks
beta_prep_checklist() {
    echo -e "${CYAN}📋 BETA PREPARATION SJEKKLISTE${NC}"
    echo -e "1. Opprett beta invite system"
    echo -e "2. Setup Discord server"
    echo -e "3. Configure user onboarding"
    echo -e "4. Prepare social media accounts"
    echo -e "5. Setup monitoring & analytics"
    echo -e "6. Create beta user documentation"
}

# Soft launch phase tasks
soft_launch_checklist() {
    echo -e "${CYAN}📋 SOFT LAUNCH SJEKKLISTE${NC}"
    echo -e "1. Send first wave invites (10-15 personer)"
    echo -e "2. Post Discord announcement"
    echo -e "3. Publish soft social media announcement"
    echo -e "4. Monitor real-time for issues"
    echo -e "5. Provide Discord support"
    echo -e "6. Collect initial feedback"
}

# Quick status check
quick_status() {
    echo -e "${BLUE}⚡ QUICK STATUS CHECK${NC}"
    
    # Check if production package exists
    if [ -f "/workspaces/snakkaz-chat/snakkaz-complete-production-ready.zip" ]; then
        echo -e "${GREEN}✅ Production package ready${NC}"
    else
        echo -e "${RED}❌ Production package missing${NC}"
    fi
    
    # Check if emergency tools exist
    if [ -f "/workspaces/snakkaz-chat/emergency-debug-fix-suite.sh" ]; then
        echo -e "${GREEN}✅ Emergency debug tools ready${NC}"
    else
        echo -e "${YELLOW}⚠️ Emergency debug tools need verification${NC}"
    fi
    
    # Check if deployment folder exists
    if [ -d "/workspaces/snakkaz-chat/snakkaz-complete-deployment" ]; then
        echo -e "${GREEN}✅ Deployment folder ready${NC}"
    else
        echo -e "${RED}❌ Deployment folder missing${NC}"
    fi
}

# Milestone celebration
celebrate_milestone() {
    local milestone="$1"
    echo -e "\n${PURPLE}🎉 MILESTONE ACHIEVED: $milestone 🎉${NC}"
    echo -e "${CYAN}Time: $(date)${NC}"
    log_task "MILESTONE" "$milestone" "ACHIEVED" "Celebration time!"
}

# Generate end of day report
end_of_day_report() {
    echo -e "\n${CYAN}📊 END OF DAY REPORT - $(date +%Y-%m-%d)${NC}"
    echo -e "${BLUE}================================================${NC}"
    
    echo -e "\n${GREEN}✅ COMPLETED TODAY:${NC}"
    grep "COMPLETED" "$LOG_FILE" | while read line; do
        echo -e "  $line"
    done
    
    echo -e "\n${YELLOW}🔄 IN PROGRESS:${NC}"
    grep "IN_PROGRESS" "$LOG_FILE" | while read line; do
        echo -e "  $line"
    done
    
    echo -e "\n${RED}❌ ISSUES ENCOUNTERED:${NC}"
    grep "FAILED" "$LOG_FILE" | while read line; do
        echo -e "  $line"
    done
    
    echo -e "\n${PURPLE}🎯 METRICS ACHIEVED:${NC}"
    grep "METRICS" "$LOG_FILE" | while read line; do
        echo -e "  $line"
    done
    
    echo -e "\n${CYAN}📅 TOMORROW'S PRIORITIES:${NC}"
    echo -e "1. Continue beta user growth"
    echo -e "2. Implement user feedback"
    echo -e "3. Community engagement activities"
    echo -e "4. Performance optimization"
}

# Main menu
show_menu() {
    echo -e "\n${CYAN}🚀 SNAKKAZ BETA LAUNCH LOGGER${NC}"
    echo -e "${BLUE}===============================${NC}"
    echo -e "1. Initialize dagens tracking"
    echo -e "2. Start ny fase"
    echo -e "3. Logg oppgave"
    echo -e "4. Vis progress"
    echo -e "5. Quick status check"
    echo -e "6. Show deployment checklist"
    echo -e "7. Show beta prep checklist"
    echo -e "8. Show soft launch checklist"
    echo -e "9. Celebrate milestone"
    echo -e "10. End of day report"
    echo -e "0. Exit"
    echo -e "\n${YELLOW}Velg option (0-10):${NC}"
}

# Main execution
main() {
    if [ $# -eq 0 ]; then
        show_menu
        read -r choice
        case $choice in
            1) init_progress && echo "Progress tracking initialized!" ;;
            2) echo "Enter phase name:"; read phase; start_phase "$phase" ;;
            3) echo "Phase:"; read phase; echo "Task:"; read task; echo "Status:"; read status; log_task "$phase" "$task" "$status" ;;
            4) show_progress ;;
            5) quick_status ;;
            6) deployment_checklist ;;
            7) beta_prep_checklist ;;
            8) soft_launch_checklist ;;
            9) echo "Milestone:"; read milestone; celebrate_milestone "$milestone" ;;
            10) end_of_day_report ;;
            0) echo "Ha en fantastisk SnakkaZ Beta launch dag! 🚀" ;;
            *) echo "Invalid option" ;;
        esac
    else
        # Command line interface
        case "$1" in
            "init") init_progress ;;
            "start") start_phase "$2" ;;
            "log") log_task "$2" "$3" "$4" "$5" ;;
            "progress") show_progress ;;
            "status") quick_status ;;
            "celebrate") celebrate_milestone "$2" ;;
            "report") end_of_day_report ;;
            *) show_menu ;;
        esac
    fi
}

main "$@"
