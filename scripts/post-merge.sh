#!/bin/bash
npm install
npm run db:push || echo "Warning: db:push failed (database may be temporarily unavailable)"
