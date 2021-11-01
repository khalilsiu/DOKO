# Deployment Guide

## Deploy Frontend

```
npm install
npm run build
```
---

## Deploy Backend

1. Install Redis and MongoDB. No extra configuration is needed.
2. Deploy the `server`

    ```
    npm install
    npm run build
    pm2 start ./dist/main.js --name=doko
    ```

    #### To restart the backend

    ```
    pm2 restart doko
    ```
