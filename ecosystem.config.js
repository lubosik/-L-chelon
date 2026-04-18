module.exports = {
  apps: [
    {
      name: 'lechelon',
      cwd: '/root/projects/lechelon',
      script: 'node_modules/.bin/next',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
    {
      name: 'lechelon-cms',
      cwd: '/root/projects/lechelon-cms',
      script: 'node_modules/.bin/strapi',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 1337,
      },
    },
  ],
}
