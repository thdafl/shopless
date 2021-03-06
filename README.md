# Shopless

> Damn I love creating repos, setting up a skeleton and then leaving it in the dust =_=

## Prerequisites

- Google OAuth setup with Google+ API enabled
  Create 'OAuth client ID' at e.g. https://console.cloud.google.com/apis/credentials?project=shopless-development

## Development

1. Assign [`.env` variables](#env-variables)

2. `yarn && yarn dev`

3. Trust local SSL: [chrome://flags/#allow-insecure-localhost](chrome://flags/#allow-insecure-localhost)

## Deploy

1. Prepare netlify for frontend and heroku for backend

Just configure them so they build on git push

2. Assign  [`.env` variables](#env-variables)

3. Deploy it

## `.env` variables

| Variables                        | Description                                                  |
| -------------------------------- | ------------------------------------------------------------ |
| `GOOGLE_KEY` and `GOOGLE_SECRET` | Google OAuth ID and secret                                   |
| `SESSION_SECRET`                 | Random string for express-session                            |
| `CLIENT_URL`                     | Frontend URL                                                 |
| `API_URL`                        | Backend URL                                                  |
| `DB_TYPE`                        | [Database type](https://typeorm.io/#/connection-options/common-connection-options). default `postgres` |
| `DB_HOST`                        | Database host                                                |
| `DB_PORT`                        | Database port. default `5432`                                |
| `DB_USERNAME`                    |                                                              |
| `DB_PASSWORD`                    |                                                              |
| `DB_DATABASE`                    |                                                              |

