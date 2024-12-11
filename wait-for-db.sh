#!/bin/sh
# wait-for-db.sh

# Wait for the PostgreSQL database to be ready
until pg_isready -h db -p 5432 -U root; do
  echo "Waiting for PostgreSQL to be ready..."
  sleep 2
done

# Run the migration command with automated input
expect -c "
spawn npm run db:push
expect {
  \"No, abort\" { send \"\033\[B\r\"; exp_continue }
  \"Yes, I want to execute all statements\" { send \"\r\" }
}
expect eof
"

# Start the Svelte app
npm run dev -- --host