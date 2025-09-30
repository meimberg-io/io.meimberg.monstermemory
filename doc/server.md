## Home und User

```sh
mkdir /srv/monstermemory
useradd -d /srv/monstermemory -s /bin/bash monstermemory
chown -R monstermemory:monstermemory /srv/monstermemory
su - monstermemory
```

### SSH

```sh
# als User monstermemory:
cd ~
mkdir .ssh && chmod 700 .ssh
touch .ssh/authorized_keys && chmod 600 .ssh/authorized_keys
vim .ssh/authorized_keys   #### user github deploy und oli
```
## Node

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> ~/.bashrc

## Zusehen, dass .bashrc auch immer geladen wird

vim ~/.profile
```

**Folgendes rein**
```sh
if [ -f ~/.bashrc ]; then
    . ~/.bashrc
fi
```

**Und speichern. Und dann...**
```sh
source ~/.bashrc
nvm install 20
nvm use 20
npm install pm2 -g
```

## Applikation installieren 

```sh
# auch als User monstermemory

git clone https://___token___@github.com/meimberg-io/io.meimberg.monstermemory/ /srv/monstermemory/app

cd /srv/monstermemory/app

npm install
npm run build
```


## Nginx

### create Site

```sh
# als root
vim /etc/nginx/sites-available/monstermemory
```
```conf

server {
    server_name monstermemory.meimberg.io;

    # Next.js (Hauptseite unter `/`)
    location / {
        proxy_pass http://localhost:5679;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        # Gzip-Komprimierung für bessere Performance
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    }

}

server {
    listen 80;
    server_name monstermemory.meimberg.io;
}


```
Dann
```sh
cd /etc/nginx/sites-enabled
ln -s ../sites-available/monstermemory .
```


### SSL

```sh
certbot --nginx -d monstermemory.meimberg.io
# mailadresse eingeben und terms akzeptieren
```


## Applikation starten

```bash
pm2 start npm --name monstermemory -- run start
pm2 save
pm2 startup
```

## Weitere Notizen

### Manuelles Redeploy / Rebuild

```bash
git pull && rm -rf .next && npm run build && pm2 restart monstermemory
```