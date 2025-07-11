module.exports = {
  apps: [
    {
      name: 'aiaffiliatepro-backend',
      script: 'dist/index.js',
      cwd: __dirname,
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ],
  deploy: {
    production: {
      user: 'djhollywood',
      host: 'ai-affliate-pro-app',
      ref: 'origin/main',
      repo: 'git@github.com:SavageHobbies/aiaffiliatepro.git',
      path: '/var/www/aiaffiliatepro/aiaffiliatepro',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production'
    }
  }
};
