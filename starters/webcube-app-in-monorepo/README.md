
# Webcube's Starter For Project In Monorepo

## Preparation

Step 1: install dependencies in monorepo's root

```bash
cd ../../
npm run update
cd -
```

Step 2: scaffold

```bash
npm run webcube:setup
```

Step 3: create one or more entry point

```bash
npm run new
```

## Run

```bash
npm run dev
```

or

```bash
npm run build
```

or

```bash
NODE_ENV=production npm run build
```

View http://localhost:8010/your-entry-point
