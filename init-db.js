db = db.getSiblingDB('keylogger_db');

db.createUser({
  user: 'user',
  pwd: 'Password123',
  roles: [
    {
      role: 'readWrite',
      db: 'keylogger_db',
    },
  ],
});

db.createCollection('logs');
db.logs.createIndex({ createdAt: -1 });

print('keylogger_db initialized successfully');