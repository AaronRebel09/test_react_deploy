#!/bin/bash
cd /home/ec2-user/app-frontend
npm run build
pm2 install typescript
pm2 start npm --name "next" -- start
pm2 startup
pm2 save
pm2 restart all
