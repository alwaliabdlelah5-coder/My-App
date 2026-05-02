-- V1: Initial Schema
CREATE TABLE IF NOT EXISTS system_logs (
    id SERIAL PRIMARY KEY,
    action TEXT NOT NULL,
    user_id TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS global_configs (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
