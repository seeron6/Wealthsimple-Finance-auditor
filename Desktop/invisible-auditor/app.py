import streamlit as st
import pandas as pd
import json
from orchestrator import run_full_audit

# Page Config (Wealthsimple uses clean, white/black aesthetics)
st.set_page_config(page_title="Invisible Auditor | AI-Native Wealth", layout="wide")

st.title("🛡️ Invisible Auditor")
st.markdown("### AI-Native Tax Loss Harvesting & Compliance")

# 1. Sidebar for Portfolio Input
with st.sidebar:
    st.header("Portfolio Snapshot")
    symbol = st.selectbox("Select Asset", ["SHOP", "VTI", "BTC", "ETH"])
    cost_basis = st.number_input("Cost Basis ($)", value=160.00)
    current_price = 117.28  # In a real app, this would be live from Finnhub
    st.metric("Current Price", f"${current_price}", delta=f"{((current_price-cost_basis)/cost_basis)*100:.2f}%")

# 2. Main Dashboard Layout
col1, col2 = st.columns([2, 1])

with col1:
    st.subheader("Agent Council Activity")
    if st.button("🚀 Run AI Audit"):
        with st.status("Council is deliberating...", expanded=True) as status:
            st.write("📡 Scout (Gemini) checking market dips...")
            # We call the orchestrator here
            report = run_full_audit(symbol, cost_basis)
            
            if "REJECTED" in report:
                status.update(label="❌ Trade Blocked by Compliance", state="error")
                st.error(report)
            else:
                status.update(label="✅ Harvesting Plan Generated", state="complete")
                st.success("Plan Ready for Review")
                st.markdown(report)

with col2:
    st.subheader("Audit Logs (Observability)")
    # Show the last 10 logs from our system_logs file
    try:
        with open("agent_council.log", "r") as f:
            logs = f.readlines()[-10:]
            for log in reversed(logs):
                st.caption(log)
    except:
        st.info("No logs yet. Run an audit to see agent activity.")