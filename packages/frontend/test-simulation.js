const fetch = require('node-fetch');

async function test() {
    try {
        const agents = [
            { id: "0", name: "Agent Alpha", currentPool: "Pool A", simulatedYield: "0.5", rebalanceThreshold: 300 },
            { id: "1", name: "Agent Beta", currentPool: "Pool A", simulatedYield: "0.5", rebalanceThreshold: 150 },
            { id: "2", name: "Agent Gamma", currentPool: "Pool B", simulatedYield: "0.5", rebalanceThreshold: 50 },
        ];

        console.log("Sending request...");
        const res = await fetch('http://localhost:3000/api/agents/simulate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ agents })
        });

        const data = await res.json();
        console.log("Response:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Error:", e);
    }
}

test();
