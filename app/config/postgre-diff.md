# When converting a script from MySQL to PostgreSQL:

## DB CREATE
- INT AUTO_INCREMENT -> SERIAL
- DATETIME -> TIMESTAMP
- ENUM -> must be declared before it can be used:
```sql
    CREATE TYPE status AS ENUM ('ok', 'inspect', 'discard');
    CREATE TABLE Items (
        id SERIAL PRIMARY KEY,
        ...
        status status
    );
```

## DB SEED
- booleans have to be true or false, not 1 or 0