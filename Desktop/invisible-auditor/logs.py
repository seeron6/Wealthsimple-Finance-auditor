import logging

logging.basicConfig(
    filename='agent_council.log',
    level=logging.INFO,
    format='%(asctime)s - [%(name)s] - %(levelname)s - %(message)s'
)

def log_decision(agent_name, decision, reason):
    logger = logging.getLogger(agent_name)
    logger.info(f"DECISION: {decision} | REASON: {reason}")
    print(f"📝 {agent_name}: {decision}")

# Example use: log_decision("Scout", "FLAGGED", "SHOP is down 21%")