# PWA Push Уведомления (Android/iOS без App Store)

## Обзор
Реализация push-уведомлений для PWA приложений на Android и iOS, установленных как ярлыки на главный экран.

## Ключевые технологии
- **Service Worker** - обработка push в фоне
- **Web Push API** + **Notifications API**
- **VAPID keys** - шифрование push сообщений
- **Firebase Cloud Messaging (FCM)** - бесплатный push сервер
- **Supabase** - хранение подписок и API

## Цели
- Push уведомления дополнительно к Telegram
- Работа на Android (Chrome) и iOS (Safari 16.4+)
- Бесплатный tier Firebase

## Текущий статус
- ✅ Telegram уведомления готовы
- ❌ Push уведомления не реализованы

## Архитектура

### Компоненты системы
1. **Frontend (PWA)**: Service Worker + Push Subscription
2. **Backend**: Supabase Functions + API routes
3. **Push Server**: Firebase Cloud Messaging
4. **Database**: Таблица push_subscriptions

### Типы уведомлений
- Ежедневные проценты (как в Telegram)
- Новые челленджи
- Важные события (пополнения, достижения)

## План реализации

### Этап 1: Firebase Setup
1. Создать Firebase проект
2. Настроить Web App
3. Получить конфиг для PWA
4. Сгенерировать VAPID ключи:
   ```bash
   npm install -g web-push
   web-push generate-vapid-keys
   ```
5. Сохранить VAPID_PUBLIC/PRIVATE_KEY в Supabase secrets

### Этап 2: Database Schema
```sql
CREATE TABLE push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  endpoint text NOT NULL,
  p256dh text NOT NULL,
  auth text NOT NULL,
  user_agent text,
  created_at timestamp with time zone DEFAULT now(),
  last_active timestamp with time zone DEFAULT now()
);
```

### Этап 3: Service Worker (public/sw.js)
```javascript
// Регистрация в push событиях
self.addEventListener('push', function(event) {
  const data = event.data.json();

  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: { url: data.url },
    actions: [
      { action: 'open', title: 'Открыть' },
      { action: 'close', title: 'Закрыть' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Обработка клика по уведомлению
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});
```

### Этап 4: Push Subscription API
**app/api/push-subscription/route.ts:**
```typescript
import { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { subscription, userId } = await request.json()

  // Сохранить подписку в БД
  const { error } = await supabase
    .from('push_subscriptions')
    .upsert({
      user_id: userId,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      user_agent: request.headers.get('user-agent')
    })

  if (error) {
    console.error('Push subscription error:', error)
    return Response.json({ error: 'Failed to save subscription' }, { status: 500 })
  }

  return Response.json({ success: true })
}
```

### Этап 5: Push Send Function
**supabase/functions/send-push/index.ts:**
```typescript
import { createClient } from 'jsr:@supabase/supabase-js@2'
import webpush from 'npm:web-push'

const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')!
const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY')!

webpush.setVapidDetails(
  'mailto:push@abundance-effect.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
)

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { user_ids, title, body, url } = await req.json()

  // Получить подписки пользователей
  const { data: subscriptions } = await supabase
    .from('push_subscriptions')
    .select('*')
    .in('user_id', user_ids)

  const results = []
  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification({
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth
        }
      }, JSON.stringify({ title, body, url }))

      results.push({ success: true, user_id: sub.user_id })
    } catch (error) {
      console.error(`Push failed for user ${sub.user_id}:`, error)
      results.push({ success: false, user_id: sub.user_id, error: error.message })
    }
  }

  return Response.json({ results })
})
```

### Этап 6: Frontend Integration
**app/layout.tsx:**
```typescript
'use client'

useEffect(() => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered')
      })
  }
}, [])
```

**Компонент разрешения push:**
```typescript
'use client'

export function PushNotificationManager({ userId }) {
  const [permission, setPermission] = useState('default')

  useEffect(() => {
    setPermission(Notification.permission)
  }, [])

  const requestPermission = async () => {
    const permission = await Notification.requestPermission()
    setPermission(permission)

    if (permission === 'granted') {
      subscribeToPush(userId)
    }
  }

  return (
    <button onClick={requestPermission}>
      {permission === 'granted' ? 'Push включены' : 'Включить push уведомления'}
    </button>
  )
}

async function subscribeToPush(userId) {
  const registration = await navigator.serviceWorker.ready
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
  })

  await fetch('/api/push-subscription', {
    method: 'POST',
    body: JSON.stringify({ subscription, userId })
  })
}
```

### Этап 7: Cron Integration
**console.cron-job.org** cron:
- URL: `https://njvbonpambjndmzprnenk.functions.supabase.co/send-push`
- Method: POST
- Body:
  ```json
  {
    "user_ids": "all",
    "title": "Daily Interest Earned",
    "body": "$0.01015751 added to your core balance",
    "url": "https://abundance-effect.vercel.app/wallet"
  }
  ```
- Schedule: Every day at 00:15 UTC

### Этап 8: Update send-notifications
Модифицировать supabase/functions/send-notifications/index.ts чтобы отправлять и push и telegram одновременно.

## Платформенные особенности

### Android (Chrome)
- ✅ Полная поддержка
- ✅ Background push
- ✅ Custom actions

### iOS (Safari)
- ⚠️ Safari 16.4+ required
- ⚠️ Требует нативного wrapper для полноценной работы
- ⚠️ Push работает только когда Safari открыт
- ❌ Не работает в Telegram Mini App

### Ограничения
- HTTPS required
- User permission needed
- Background push зависит от платформы
- iOS ограничения на кастомизацию

## Тестирование
1. Android PWA: Установить на главный экран → разрешить push → тестировать
2. iOS PWA: iOS 16.4+ → Safari → Add to Home Screen → тестировать
3. Проверить доставку push сообщений
4. Проверить клик по уведомлению

## Дальнейшие улучшения
- Персонализированные уведомления по времени активности
- A/B тестирование разных типов уведомлений
- Аналитика доставки и кликов
- Retry механизм для failed push
- Notification settings в профиле пользователя

## Ссылки
- [Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [VAPID](https://tools.ietf.org/html/rfc8292)
