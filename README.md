# Twitter API Clone

Reproducing the functionalities of twitter, including users who can follow other users, be followed, can create tweets and comment on them.

## Development

First, install the dependencies:

```bash
npm i
```

You have to fill out the .env file.

To run the database:

```bash
docker compose up -d 
```

To initialize the database schema:

```bash
docker compose exec -T postgres psql -U test test < TwitterClone.sql
```

Than to run the server:

```bash
node index.js | pino-pretty
```

## Docs

Open [http://localhost:3000/api-docs/#/](http://localhost:3000/api-docs/#/) within your browser to see the result.