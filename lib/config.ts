
export const SYSTEM_CONFIG = {
  "database_config_filter": {
    "active_profile": "cloud_supabase",
    "profiles": [
      {
        "id": "cloud_supabase",
        "type": "cloud",
        "engine": "postgresql",
        "status": "primary"
      }
    ]
  },
  "global": {
    "timezone": "Asia/Aden",
    "languages": ["ar", "en"],
    "currency": "ر.ي",
    "tax_percent": 15,
    "working_hours": { "start": "08:00", "end": "22:00" }
  },
  "pharmacy": {
    "expiry_alert_days": 30,
    "low_stock_threshold": 10
  }
};
