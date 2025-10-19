# Deployment

Automatic deployment on push to `main` branch.

## How It Works

Push to `main` → GitHub Actions:
1. Builds Docker image
2. Pushes to GHCR
3. SSHs to server
4. Updates container

**Time:** ~3-4 minutes

## Initial Setup

**First time?** Complete setup first: [GITHUB-SETUP.md](GITHUB-SETUP.md)

This covers:
- GitHub Variables & Secrets
- DNS configuration
- Server infrastructure
- SSH keys

## Deploy

```bash
git push origin main
```

Watch: https://github.com/olivermeimberg/io.meimberg.monstermemory/actions

## Operations

**View logs:**
```bash
ssh deploy@hc-02.meimberg.io "docker logs monstermemory -f"
```

**Restart:**
```bash
ssh deploy@hc-02.meimberg.io "cd /srv/projects/monstermemory && docker compose restart"
```

**Manual deploy:**
```bash
ssh deploy@hc-02.meimberg.io "cd /srv/projects/monstermemory && docker compose pull && docker compose up -d"
```

## Troubleshooting

**Container not starting:**
```bash
ssh deploy@hc-02.meimberg.io "docker compose -f /srv/projects/monstermemory/docker-compose.yml logs"
```

**SSL issues:**
```bash
ssh root@hc-02.meimberg.io "docker logs traefik | grep monstermemory"
```

**DNS check:**
```bash
dig monstermemory-2.meimberg.io +short
```

