# Challenge Verification System Documentation

## Обзор исправлений

Исправил верификационный скрипт для челленджа "Add Your First Wish". Проблема была в том, что старый скрипт пытался обратиться к несуществующему полю `count` в таблице `user_wishes`.

### Что исправлено:

**Старый скрипт (не работал):**
```javascript
const { data, error } = await supabase.from('user_wishes').select('count').eq('user_id', userId);
const count = data[0].count;
return count > 0;
```

**Новый исправленный скрипт:**
```javascript
const { count, error } = await supabase.from('user_wishes').select('*', { count: 'exact', head: true }).eq('user_id', userId);
return !error && count > 0;
```

## Как работает система верификации

### 1. Выполнение верификационного скрипта

Скрипт выполняется в функции `executeVerificationScript()` в файле `app/actions/challenges.ts`:

```typescript
async function executeVerificationScript(scriptDefinition: any, context: {
  userId: string;
  challengeData: any;
  supabase: any;
}) {
  try {
    const { function: scriptFunction } = scriptDefinition;

    // Create the async function from the script string
    const scriptCode = `return (async function({ userId, supabase, challengeData }) { ${scriptFunction} });`;
    const scriptFunctionExecutor = new Function(scriptCode);
    const asyncVerifier = scriptFunctionExecutor();

    // Run the verification script
    const result = await asyncVerifier(context);

    return Boolean(result);
  } catch (error) {
    return false;
  }
}
```

### 2. Когда скрипт вызывается

**Ручная проверка (кнопка "Check"):**
1. Пользователь нажимает "Check" на активном челлендже
2. Фронтенд вызывает `updateParticipation(challengeId, 'completed')`
3. Сервер выполняет `updateParticipationAction()`
4. Если `status === 'completed'` и `verification_type === 'script'`, выполняется скрипт
5. Результат: true → челлендж завершается, false → ошибка верификации

**Автоматическое завершение (триггер в БД):**
1. Пользователь добавляет желание в `user_wishes`
2. Срабатывает триггер `auto_complete_system_challenges`
3. Скрипт может автоматически завершить челлендж

### 3. Что возвращает скрипт

Верификационный скрипт должен возвращать **boolean**:
- `true` - челлендж прошел верификацию
- `false` - верификация не пройдена или ошибка

### 4. Ошибки и их обработка

Скрипт обрабатывает следующие ошибки:
- Ошибки базы данных (`error !== null`)
- Сетевые проблемы (исключения в `try/catch`)
- Проблемы выполнения (невалидный JavaScript)

## Ручное тестирование

### Тест 1: Пользователь без желаний
```sql
-- Проверить пользователя без желаний
SELECT COUNT(*) FROM user_wishes WHERE user_id = 'test-user-id';
-- Должен вернуть: 0

-- Выполнить скрипт → должен вернуть false
```

### Тест 2: Пользователь с желаниями
```sql
-- Добавить тестовое желание
INSERT INTO user_wishes (user_id, title, description) VALUES ('test-user-id', 'Test wish', 'Test description');

-- Проверить
SELECT COUNT(*) FROM user_wishes WHERE user_id = 'test-user-id';
-- Должен вернуть: 1

-- Выполнить скрипт → должен вернуть true
```

### Тест 3: Проверка через API
```bash
# Присоединиться к челленджу
POST /api/challenges/join/{challenge-id}

# Проверить завершение
POST /api/challenges/update/{challenge-id}
Body: { "status": "completed" }
```

## Логика исполнения скрипта

```
Input: { userId, supabase, challengeData }

1. supabase.from('user_wishes').select('*', { count: 'exact', head: true }).eq('user_id', userId)
2. Получить результат: { count: N, error: E }
3. Вернуть: !E && N > 0

Output: boolean (true/false)
```

### Примеры:
- count = 0, error = null → `true && false` = **false**
- count = 1, error = null → `true && true` = **true**
- count = 1, error = "DB error" → `false && true` = **false**
- Исключение → **false** (catch)

## Файлы измененные

1. `supabase/migrations/20251129100000_create_challenges_system.sql` - исправлен verification_logic
2. `utils/__tests__/challengeVerification.test.ts` - добавлены тесты (нужен Jest для запуска)

## Запуск миграции

```bash
# Применить миграцию к базе данных
supabase db reset
# или
supabase migration up
```

После применения миграции старый челлендж будет иметь исправленный скрипт верификации.
