# Настройка pg_cron для ежедневного начисления процентов

## Решение внутри Supabase

Поскольку Cron Triggers недоступны в dashboard'е, используем pg_cron extension для автоматического запуска через базу данных.

## Шаг 1: Связаться с Supabase Support

**Обязательно**: Запросите активацию pg_cron extension у Supabase поддержки:
- Зайдите в Supabase Dashboard → Support
- Создайте тикет с просьбой активировать pg_cron extension для вашего проекта
- Укажите project ID: `njebonpambjndmzpmenk`

## Шаг 2: Применить миграцию

После активации pg_cron:

```bash
npx supabase db push --include-all
```

Это применит миграцию `20241130100001_setup_daily_interest_cron.sql` которая:
- Создаст функцию `daily_interest_cron_job()`
- Запланирует ежедневный запуск в 00:00 UTC

## Шаг 3: Вручную в SQL Editor

Если миграция не сработала, выполните в SQL Editor:

```sql
-- Попробовать активировать pg_cron
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Создать функцию
CREATE OR REPLACE FUNCTION daily_interest_cron_job()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_record RECORD;
    daily_rate numeric := 0.000633;
    total_income numeric;
    to_core_amount numeric;
    to_wallet_amount numeric;
    processed_count integer := 0;
    total_interest numeric := 0;
BEGIN
    FOR user_record IN
        SELECT id, aicore_balance, wallet_balance, COALESCE(reinvest_setup, 100) as reinvest_percentage
        FROM users
        WHERE aicore_balance > 0
    LOOP
        total_income := user_record.aicore_balance * daily_rate;
        to_core_amount := total_income * (user_record.reinvest_percentage::numeric / 100);
        to_wallet_amount := total_income * ((100 - user_record.reinvest_percentage)::numeric / 100);

        UPDATE users
        SET
            aicore_balance = (aicore_balance + to_core_amount)::numeric(20,10),
            wallet_balance = (wallet_balance + to_wallet_amount)::numeric(20,10)
        WHERE id = user_record.id;

        IF to_core_amount > 0 THEN
            INSERT INTO core_operations (user_id, amount, type)
            VALUES (user_record.id, to_core_amount::numeric(20,10), 'interest');
        END IF;

        IF to_wallet_amount > 0 THEN
            INSERT INTO core_operations (user_id, amount, type)
            VALUES (user_record.id, to_wallet_amount::numeric(20,10), 'interest');
        END IF;

        processed_count := processed_count + 1;
        total_interest := total_interest + total_income;
    END LOOP;

    RAISE NOTICE 'Daily interest cron job completed. Processed: %, Total interest: %', processed_count, total_interest::numeric(20,10);
END;
$$;

-- Запланировать ежедневный запуск
SELECT cron.schedule(
    'daily-interest-cron',
    '0 0 * * *', -- Каждый день в полночь UTC
    'SELECT daily_interest_cron_job();'
);
```

## Шаг 4: Проверить работу

```sql
-- Проверить запланированные джобы
SELECT * FROM cron.job;

-- Ручной тест функции
SELECT daily_interest_cron_job();

-- Проверить логи операции
SELECT * FROM core_operations
WHERE type = 'interest'
ORDER BY created_at DESC
LIMIT 10;
```

## Отключение cron

```sql
-- Удалить планировщик
SELECT cron.unschedule('daily-interest-cron');

-- Удалить функцию
DROP FUNCTION daily_interest_cron_job();
```

## Особенности

- Функция работает с высокой точностью (10 знаков после запятой)
- Обрабатывает всех пользователей с `aicore_balance > 0`
- Распределяет процент между ядром и кошельком согласно `reinvest_setup`
- Логирует все операции в `core_operations`
