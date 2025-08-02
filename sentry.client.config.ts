import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: "https://ddbebd06d1f7a702d788f2f5cb45379e@o4509758168956928.ingest.us.sentry.io/4509758189797376",
  integrations: [
    Sentry.feedbackIntegration({
      // Additional SDK configuration goes in here, for example:
      colorScheme: "system",
    }),
  ],
})
