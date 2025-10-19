# Monstermemory

A Next.js memory game featuring adorable monsters.

## Quick Start

### Local Development
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Docker Development
```bash
docker-compose up --build
```
Open [http://localhost:8201](http://localhost:8201)

## Deployment

**Automatic deployment on push to `main` branch.**

### Initial Setup

**First time?** See [GITHUB-SETUP.md](GITHUB-SETUP.md) for:
- GitHub Variables & Secrets configuration
- DNS setup
- Server infrastructure prerequisites

### Deploy

```bash
git push origin main
```

Watch progress: https://github.com/olivermeimberg/io.meimberg.monstermemory/actions

**Deployment time:** ~3-4 minutes

**See:** [DEPLOYMENT.md](DEPLOYMENT.md) for operations and troubleshooting

## Project Structure

```
├── src/
│   ├── app/           # Next.js App Router
│   ├── components/    # React components
│   ├── hooks/         # Custom hooks
│   └── utils/         # Utilities
├── public/            # Static assets
├── docker-compose.yml # Unified dev/prod config
├── Dockerfile         # Multi-stage build
└── .github/workflows/ # CI/CD pipeline
```

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Testing**: Jest + React Testing Library
- **Deployment**: Docker + GitHub Actions
- **Analytics**: Matomo (optional)

## Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests
npm run test:ci      # Run tests with coverage
```

### Docker Profiles
```bash
# Development (with volume mounts)
docker-compose --profile dev up

# Production (no volume mounts)
docker-compose --profile prod up
```

## Environment Variables

### Local (.env)
```bash
NODE_ENV=development
APP_PORT=8201
```

### Production (auto-generated)
```bash
NODE_ENV=production
APP_PORT=<from GitHub variable>
PORT=5679
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test:ci`
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.