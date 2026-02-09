module.exports = {
    apps: [
        {
            name: 'backend',
            cwd: './carbonos/backend',
            script: 'venv/bin/uvicorn',
            args: 'app.main:app --host 0.0.0.0 --port 8000',
            interpreter: 'none',
            env: {
                NODE_ENV: 'production',
            },
            env_file: './carbonos/backend/.env',
            watch: false,
            max_memory_restart: '500M',
            error_file: './logs/backend-error.log',
            out_file: './logs/backend-out.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss',
        },
        {
            name: 'frontend',
            cwd: './carbonos',
            script: 'npm',
            args: 'start',
            interpreter: 'none',
            env: {
                NODE_ENV: 'production',
                PORT: 3000,
            },
            watch: false,
            max_memory_restart: '500M',
            error_file: './logs/frontend-error.log',
            out_file: './logs/frontend-out.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss',
        },
    ],
};
