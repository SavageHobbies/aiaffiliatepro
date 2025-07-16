require('dotenv').config();

module.exports = {
  apps: [
    {
      name: "aiaffiliatepro-backend",
      script: "dist/index.js",
      cwd: __dirname,
      env_production: {
        NODE_ENV: "production",
        SESSION_SECRET: process.env.SESSION_SECRET,
        DATABASE_URL: process.env.DATABASE_URL,
        PGDATABASE: process.env.PGDATABASE,
        PGHOST: process.env.PGHOST,
        PGPORT: process.env.PGPORT,
        PGUSER: process.env.PGUSER,
        PGPASSWORD: process.env.PGPASSWORD,
        PROD_DOMAINS: process.env.PROD_DOMAINS,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
        ISSUER_URL: process.env.ISSUER_URL,
        GEMINI_API_KEY: process.env.GEMINI_API_KEY,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY
      }
    }
  ],
  deploy: {
    production: {
      user: "djhollywood",
      host: "ai-affliate-pro-app",
      key: "G:\\Websites\\Server Files\\ppk\\digitalocean_private_2277_openssh",
      ssh_options: "StrictHostKeyChecking=no",
      ref: "origin/main",
      repo: "git@github.com:SavageHobbies/aiaffiliatepro.git",
      path: "/var/www/aiaffiliatepro/aiaffiliatepro",
      "post-deploy": "npm install && npm run build && pm2 reload ecosystem.config.cjs --env production"
    }
  }
};
