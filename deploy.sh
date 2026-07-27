#!/bin/bash
# Gokhan Degirmencioglu - tek komutla deploy
# Kullanim (kendi bilgisayarindan): ./deploy.sh
set -e
ssh prod-s1 << 'REMOTE'
set -e
cd /opt/customers/gokhan/app
echo ">> Git pull..."
git pull
echo ">> Docker rebuild..."
docker compose -f /opt/customers/gokhan/docker-compose.yml up -d --build
echo ">> Durum:"
docker ps --filter name=gokhan --format 'table {{.Names}}\t{{.Status}}'
echo ">> Deploy tamam: http://116.202.105.120:9999"
REMOTE
