# Shopless

> Damn I love creating repos, setting up a skeleton and then leaving it in the dust =_=

## Prerequisites

- Firebase account with Firebase enabled
- Google OAuth setup with Google+ API enabled
  Create 'OAuth client ID' at e.g. https://console.cloud.google.com/apis/credentials?project=shopless-development

## Development

1. Assign [Env variables](#env-variables)

2. `yarn && yarn dev`

## Deploy

1. Prepare netlify for frontend and heroku for backend

Just configure them so they build on git push

2. Assign [Env variables](#env-variables)

3. Deploy it

## Env variables

| Variables                        | Description                            |
| -------------------------------- | -------------------------------------- |
| `GOOGLE_KEY` and `GOOGLE_SECRET` | Google OAuth ID and secret             |
| `SESSION_SECRET`                 | Random string for express-session      |
| `FIREBASE_ADMIN_SERVICE_ACCOUNT` | JSON of firebase admin service account |
| `CLIENT_URL`                     | Frontend URL                           |
| `API_URL`                        | Backend URL                            |
