# Telegram Authentication - Ответы на вопросы

## ✅ 1. Ссылка на бота добавлена

Теперь при нажатии на кнопку "Continue with Telegram" на веб-сайте:
- Откроется новая вкладка с ботом: `https://t.me/AbundanceEffectBot`
- Пользователь может открыть бота и запустить приложение

---

## 2. Как логиниться через Telegram НЕ в Mini App?

### Проблема:
Текущая реализация работает **только** через Telegram Mini App (WebApp). Для входа через Telegram на обычном сайте нужен **Telegram Login Widget**.

### Решение: Telegram Login Widget

Это официальный виджет от Telegram для авторизации на сайтах (как "Login with Google").

#### Шаг 1: Настройте домен в BotFather

```
/setdomain
```
Введите ваш домен (например: `abundance-effect.vercel.app`)

#### Шаг 2: Добавьте виджет на страницу логина

Замените текущую кнопку Telegram на виджет:

```tsx
<script 
  async 
  src="https://telegram.org/js/telegram-widget.js?22" 
  data-telegram-login="AbundanceEffectBot" 
  data-size="large" 
  data-auth-url="https://your-domain.com/api/auth/telegram-callback"
  data-request-access="write"
></script>
```

#### Шаг 3: Создайте callback endpoint

`app/api/auth/telegram-callback/route.ts`:
```typescript
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Получите данные от Telegram
  const id = searchParams.get('id');
  const first_name = searchParams.get('first_name');
  const username = searchParams.get('username');
  const photo_url = searchParams.get('photo_url');
  const auth_date = searchParams.get('auth_date');
  const hash = searchParams.get('hash');
  
  // Проверьте подпись (важно для безопасности!)
  const botToken = process.env.TELEGRAM_BOT_TOKEN!;
  const dataCheckString = Object.keys(searchParams)
    .filter(key => key !== 'hash')
    .sort()
    .map(key => `${key}=${searchParams.get(key)}`)
    .join('\n');
    
  const secretKey = crypto.createHash('sha256').update(botToken).digest();
  const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
  
  if (hmac !== hash) {
    return NextResponse.json({ error: 'Invalid hash' }, { status: 403 });
  }
  
  // Создайте/найдите пользователя через ваш API
  // ...
  
  // Редирект на главную
  return NextResponse.redirect(new URL('/', request.url));
}
```

---

## 3. Почему telegram_id не появился в Supabase?

### Причина:
Вы зарегистрировались через **Google**, а не через Telegram!

### Как проверить:

1. Откройте Supabase Dashboard → **Table Editor** → `users`
2. Найдите вашу запись
3. Проверьте поля:
   - `telegram_id` - будет `null` если вход через Google
   - `username` - будет `null` если вход через Google  
   - `first_name` - будет заполнено из Google (полное имя)

### Решение:

**Для Google пользователей** - это нормально! `telegram_id` заполняется только при входе через Telegram.

**Если хотите протестировать Telegram вход:**
1. Откройте бота в Telegram: `https://t.me/AbundanceEffectBot`
2. Нажмите `/start`
3. Нажмите кнопку "Open App"
4. Приложение откроется в Telegram
5. Автоматически создастся новый пользователь с `telegram_id`

---

## 4. Почему перекидывает на главную вместо входа?

### Причина:
Вы **уже авторизованы**! Google OAuth создал сессию, которая сохранилась в cookies.

### Как это работает:

1. **Главная страница (`app/page.tsx`)** проверяет авторизацию через `useUser()`
2. Если `user` существует → показывает профиль
3. Если `user === null` → показывает кнопку "Войти"

### Решение:

**Если хотите протестировать логин заново:**

1. **Выйдите из аккаунта:**
   - Нажмите кнопку "Выйти" на главной странице
   
2. **Или очистите cookies:**
   - Откройте DevTools (F12)
   - Application → Cookies → удалите все cookies для localhost
   
3. **Или используйте Incognito режим:**
   - Ctrl+Shift+N (Chrome)
   - Откройте `http://localhost:3000`

---

## 5. Как работает текущая система?

### Google OAuth:
1. Пользователь нажимает "Continue with Google"
2. Редирект на Google → выбор аккаунта
3. Редирект обратно на `/auth/callback`
4. Supabase создает пользователя в `auth.users`
5. **Триггер** автоматически создает запись в `public.users`
6. Поля из Google:
   - `first_name` ← `full_name` из Google
   - `avatar_url` ← `avatar_url` из Google
   - `telegram_id` ← `null`

### Telegram WebApp (Mini App):
1. Пользователь открывает бота в Telegram
2. Нажимает "Open App"
3. `UserContext` обнаруживает Telegram данные
4. Вызывает `/api/auth/telegram-user`
5. API создает пользователя в `auth.users` + `public.users`
6. Поля из Telegram:
   - `telegram_id` ← ID из Telegram
   - `username` ← username из Telegram
   - `first_name` ← first_name из Telegram
   - `avatar_url` ← photo_url из Telegram

---

## Рекомендации

### Для production:

1. **Используйте Telegram Login Widget** для веб-сайта
2. **Оставьте Telegram WebApp** для Mini App в боте
3. **Объедините аккаунты** (опционально):
   - Позвольте пользователю привязать Telegram к Google аккаунту
   - Добавьте поле `google_id` в таблицу `users`

### Для тестирования:

1. **Google вход** - работает на сайте ✅
2. **Telegram вход (WebApp)** - работает только в боте ✅
3. **Telegram вход (Widget)** - нужно настроить (см. выше)

---

## Следующие шаги

1. ✅ Протестируйте Google вход (уже работает)
2. ✅ Протестируйте Telegram WebApp (откройте бота)
3. [ ] Настройте Telegram Login Widget (для веб-сайта)
4. [ ] Добавьте возможность привязки аккаунтов
