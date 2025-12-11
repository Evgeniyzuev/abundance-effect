# Оптимизация уровней - Удаление избыточных запросов к level_thresholds

## Проблема

В логах Supabase наблюдались избыточные запросы к таблице `level_thresholds`, хотя уровень пользователя автоматически рассчитывается в базе данных и сохраняется в поле `users.level`.

## Архитектура системы уровней

### Текущая реализация (ОПТИМАЛЬНАЯ):

```sql
-- Триггер автоматически рассчитывает уровень при изменении баланса
CREATE OR REPLACE FUNCTION calculate_user_level(aicore_balance numeric)
RETURNS integer
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
    threshold_record RECORD;
    calculated_level integer := 0;
BEGIN
    -- Функция САМА запрашивает level_thresholds внутри PostgreSQL
    FOR threshold_record IN
        SELECT level, core_required
        FROM level_thresholds
        ORDER BY level DESC
    LOOP
        IF aicore_balance >= threshold_record.core_required THEN
            calculated_level := threshold_record.level;
            EXIT;
        END IF;
    END LOOP;
    RETURN calculated_level;
END;
$$;

-- Триггер автоматически вызывается при изменении aicore_balance
CREATE TRIGGER trigger_update_user_level
    BEFORE INSERT OR UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_user_level();
```

### Преимущества текущей архитектуры:
- ✅ **Автоматический расчет** - уровень обновляется мгновенно при изменении баланса
- ✅ **Консистентность данных** - нет рассинхронизации между расчетом и отображением
- ✅ **Производительность** - расчет происходит на уровне БД
- ✅ **Целостность** - данные всегда актуальны

## Проблема: Избыточные клиентские запросы

### Что происходит сейчас:
```
GET /rest/v1/level_thresholds?select=level,core_required&order=level.asc
```

### Почему это избыточно:
1. **Уровень уже рассчитан** и сохранен в `users.level`
2. **Триггер автоматически обновляет** уровень при изменении баланса
3. **Клиенту НЕ нужно знать пороги** для отображения текущего уровня

## Оптимизированные решения

### 1. Получение данных пользователя

**Вместо:**
```typescript
// ❌ Избыточно - запрашивает данные, которые уже есть
const { data: user } = await supabase
  .from('users')
  .select('wallet_balance, aicore_balance, reinvest_setup, level')
  .eq('id', userId)
  .single()

// И отдельный запрос к level_thresholds
const { data: thresholds } = await supabase
  .from('level_thresholds')
  .select('level, core_required')
  .order('level.asc')
```

**Используйте:**
```typescript
// ✅ Оптимально - все данные в одном запросе
const { data: user } = await supabase
  .from('users')
  .select('wallet_balance, aicore_balance, reinvest_setup, level')
  .eq('id', userId)
  .single()

// Уровень пользователя уже готов к использованию
console.log(`Текущий уровень: ${user.level}`)
```

### 2. Отображение прогресса до следующего уровня

**Если нужно показать прогресс до следующего уровня:**

```typescript
// ✅ Оптимальный подход - запрос только при необходимости
const getNextLevelProgress = async (userId: string) => {
  const { data: user } = await supabase
    .from('users')
    .select('aicore_balance, level')
    .eq('id', userId)
    .single()

  // Запрашиваем пороги только когда нужно показать прогресс
  const { data: thresholds } = await supabase
    .from('level_thresholds')
    .select('level, core_required')
    .gt('level', user.level)  // Только следующие уровни
    .order('level.asc')
    .limit(1)

  if (thresholds && thresholds.length > 0) {
    const nextLevel = thresholds[0]
    const progress = (user.aicore_balance / nextLevel.core_required) * 100
    return { currentLevel: user.level, progress, nextLevel: nextLevel.level }
  }

  return { currentLevel: user.level, progress: 100, nextLevel: null }
}
```

### 3. Компонент отображения уровня

**Оптимизированный компонент:**
```typescript
// components/LevelDisplay.tsx
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

interface UserLevelData {
  level: number
  aicore_balance: number
  wallet_balance: number
}

export function LevelDisplay({ userId }: { userId: string }) {
  const [userData, setUserData] = useState<UserLevelData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('users')
          .select('level, aicore_balance, wallet_balance')
          .eq('id', userId)
          .single()

        if (error) throw error
        setUserData(data)
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [userId])

  if (loading) return <div>Загрузка...</div>
  if (!userData) return <div>Ошибка загрузки</div>

  return (
    <div className="level-display">
      <h3>Уровень {userData.level}</h3>
      <p>Баланс AI Core: {userData.aicore_balance}</p>
      <p>Баланс кошелька: {userData.wallet_balance}</p>
    </div>
  )
}
```

### 4. Оптимизация UserContext

**Обновленный UserContext для использования готового уровня:**
```typescript
// context/UserContext.tsx - фрагмент
const fetchDbUser = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        telegram_id,
        username,
        first_name,
        last_name,
        avatar_url,
        phone_number,
        created_at,
        updated_at,
        wallet_balance,
        aicore_balance,
        level,           // <-- Уровень уже рассчитан!
        reinvest_setup,
        referrer_id
      `)
      .eq('id', userId)
      .single()

    if (error || !data) {
      // ... обработка ошибки
      return null
    }
    return data as DbUser
  } catch (error) {
    console.error('Unexpected error fetching user:', error)
    return null
  }
}
```

## Миграция для удаления избыточных запросов

### Шаг 1: Анализ использования level_thresholds

```sql
-- Найти все обращения к level_thresholds за последние 24 часа
SELECT 
  schemaname,
  tablename,
  query,
  calls,
  total_time
FROM pg_stat_statements 
WHERE query LIKE '%level_thresholds%'
ORDER BY calls DESC;
```

### Шаг 2: Удаление избыточных запросов

Если в коде есть прямые обращения к `level_thresholds`:

```typescript
// Найти и заменить все случаи:

// ❌ Найти:
const { data } = await supabase.from('level_thresholds').select('*')

// ✅ Заменить на:
const { data: user } = await supabase
  .from('users')
  .select('level')
  .eq('id', userId)
```

### Шаг 3: Обновление компонентов

**Компоненты, которые нужно обновить:**

1. **UserContext** - уже обновлен ✅
2. **LevelProvider** - обновить для использования готового уровня
3. **Компоненты отображения уровня** - использовать `user.level` вместо запросов

## Результаты оптимизации

### Ожидаемые улучшения:
- **-50-70% запросов** к `level_thresholds`
- **-30-40% общего трафика** к БД
- **Улучшенная производительность** за счет меньшего количества запросов
- **Сниженная нагрузка** на PostgreSQL

### Мониторинг результатов:

```sql
-- Мониторинг запросов к level_thresholds
SELECT 
  date_trunc('hour', query_start) as hour,
  COUNT(*) as requests,
  AVG(total_time) as avg_time
FROM pg_stat_activity 
WHERE query LIKE '%level_thresholds%'
  AND query_start > NOW() - INTERVAL '24 hours'
GROUP BY hour
ORDER BY hour DESC;
```

## Заключение

Оптимизация основана на использовании уже рассчитанного и сохраненного в БД поля `users.level` вместо повторных запросов к `level_thresholds`. Это значительно снижает нагрузку на БД и упрощает архитектуру приложения.

**Ключевое правило:** Если уровень автоматически рассчитывается в БД и сохраняется в поле `users.level`, то клиентские запросы к `level_thresholds` избыточны и должны быть удалены.