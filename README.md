# Gezlcation

Planlæg dine danske feriedage optimalt ved at kombinere offentlige helligdage og weekender.

## Hvad gør den?

Gezlcation beregner lokalt hvilke perioder der giver mest fri for færrest feriedage — baseret på de officielle danske helligdage.

- **Top 3 ferieperioder** — de tre perioder med bedst ROI for hele året
- **Din bedste ferie** — giv en periode og et feriebudget, få ét optimalt svar
- **Årsoverskridelse** — finder perioder der krydser jul/nytår automatisk
- **Ingen ekstern API** — alle helligdage beregnes lokalt med Meeus/Jones/Butcher-algoritmen

## Tech stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS v4
- Docker + nginx (til produktion)

## Kom i gang

```bash
npm install
npm run dev
```

Åbn [http://localhost:5173](http://localhost:5173).

## Docker

```bash
npm run docker:up
```

Kører på [http://localhost:3000](http://localhost:3000).

## Helligdage

Alle danske helligdage beregnes dynamisk per år. Store Bededag er korrekt udeladt fra 2024 og frem.

---

Skabt af [Gustav Weber Kinch](mailto:ggeezzll@proton.me)
