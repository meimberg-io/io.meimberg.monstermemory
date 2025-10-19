# GitHub Setup

Initial configuration required for automatic deployment.

## GitHub Variables

**Settings → Variables → Actions**

| Name | Value | Description |
|------|-------|-------------|
| `APP_DOMAIN` | `monstermemory-2.meimberg.io` | Application domain |
| `SERVER_HOST` | `hc-02.meimberg.io` | Server hostname |
| `SERVER_USER` | `deploy` | SSH user (optional, defaults to `deploy`) |

## GitHub Secrets

**Settings → Secrets → Actions**

| Name | Value | Description |
|------|-------|-------------|
| `SSH_PRIVATE_KEY` | `<private key contents>` | Deploy user private key |

**Get SSH private key:**
```bash
# Linux/Mac
cat ~/.ssh/id_rsa
# Or your deploy key: cat ~/.ssh/deploy_key

# Windows PowerShell
Get-Content C:\Users\YourName\.ssh\id_rsa
```

Copy entire output including `-----BEGIN` and `-----END` lines.



# DNS Configuration

**Add A record:**
```
monstermemory-2.meimberg.io  →  CNAME  →  hc-02.meimberg.io
```

# Server Infrastructure

**Prerequisites (one-time setup):**

Run Ansible to setup server infrastructure:

```bash
cd ../io.meimberg.ansible

# Install Ansible collections
ansible-galaxy collection install -r requirements.yml

# Run infrastructure setup
ansible-playbook -i inventory/hosts.ini playbooks/site.yml --vault-password-file vault_pass
```

**This installs:**
- ✅ Docker + Docker Compose
- ✅ Traefik reverse proxy (automatic SSL)
- ✅ `deploy` user (for deployments)
- ✅ Firewall rules (SSH, HTTP, HTTPS)
- ✅ Automated backups

**Server must be ready before first deployment!**

**Note:** Ansible automatically creates deploy user and configures SSH access.



# First Deployment

After completing all steps above:

```bash
git add .
git commit -m "Setup deployment"
git push origin main
```

**Monitor:** https://github.com/olivermeimberg/io.meimberg.monstermemory/actions

**Deployment takes ~3-4 minutes:**
1. ✅ Tests run (lint, build, jest)
2. ✅ Docker image builds
3. ✅ Pushes to GitHub Container Registry
4. ✅ SSHs to server
5. ✅ Deploys container with Traefik labels
6. ✅ App live at https://monstermemory-2.meimberg.io

# Additional Information

## Checklist

Before first deployment:

- [ ] GitHub Variables added: `APP_DOMAIN`, `SERVER_HOST`, `SERVER_USER`
- [ ] GitHub Secret `SSH_PRIVATE_KEY` added
- [ ] DNS A record configured
- [ ] Server infrastructure deployed via Ansible
- [ ] Can SSH to server: `ssh deploy@hc-02.meimberg.io`

**Estimated setup time:** 15-20 minutes


## Troubleshooting

**GitHub Actions fails at deploy step:**
```bash
# Test SSH manually
ssh -i ~/.ssh/deploy_key deploy@hc-02.meimberg.io

# Check deploy user exists
ssh root@hc-02.meimberg.io "id deploy"
```

**Container not starting:**
```bash
ssh deploy@hc-02.meimberg.io "docker logs monstermemory"
```

**SSL certificate issues:**
```bash
# Check Traefik logs
ssh root@hc-02.meimberg.io "docker logs traefik | grep monstermemory"

# Verify DNS propagated
dig monstermemory-2.meimberg.io +short
```

**Image pull failed:**
- Image must be public or
- Add GHCR authentication on server



## Changing Domain

1. Update DNS A record
2. Update GitHub Variable `APP_DOMAIN`
3. Push to trigger redeploy

No code changes needed!



## Related Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment operations
- [../io.meimberg.ansible/README.md](../io.meimberg.ansible/README.md) - Ansible overview
- [../io.meimberg.ansible/docs/SETUP.md](../io.meimberg.ansible/docs/SETUP.md) - Server setup
- [../io.meimberg.ansible/docs/SSH-KEYS.md](../io.meimberg.ansible/docs/SSH-KEYS.md) - SSH key configuration

