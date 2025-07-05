module.exports = {
  apps: [
    {
      name: 'expense-tracker-backend',
      script: './dist/server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
        PORT: 5000,
        FRONTEND_URL: 'http://localhost:3000'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
        FRONTEND_URL: 'http://13.233.29.88:3000'
      },
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      merge_logs: true,
      max_memory_restart: '500M',
      node_args: '--max-old-space-size=512',
      watch: false,
      ignore_watch: ['node_modules', 'logs'],
      restart_delay: 4000
    }
  ]
};
