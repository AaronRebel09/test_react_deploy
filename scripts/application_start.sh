#!/bin/bash
cd /home/ec2-user/app-frontend
npm run build
npm start
#pm2 install typescript
#pm2 start npm --name "nextapp" -- start
#pm2 startup
#pm2 save
#pm2 restart all
