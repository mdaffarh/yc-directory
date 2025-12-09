export const STARTUP_CATEGORIES = ["Tech", "Health", "Education", "Finance", "E-commerce", "SaaS", "AI", "Marketing", "Gaming", "Food & Beverage", "Travel", "Real Estate", "Fashion", "Sports", "Entertainment", "Other"] as const

export type StartupCategory = (typeof STARTUP_CATEGORIES)[number]
