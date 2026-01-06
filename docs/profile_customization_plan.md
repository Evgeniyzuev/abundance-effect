# План: Настройка профиля и Публичные страницы

Этот документ описывает план по реализации возможности редактирования профиля пользователя и создания публично доступных страниц профилей.

## 1. Изменения в Базе Данных (Supabase)

Мы создадим отдельную таблицу `user_profiles` для хранения публичной информации, чтобы отделить её от приватных данных аккаунта.

### Новая таблица: `user_profiles`
- `user_id` (uuid, references users.id): Внешний ключ.
- `bio` (text): Описание профиля/БИО.
- `social_links` (jsonb): Объект со ссылками на соцсети (telegram, instagram, vk, website и т.д.).
- `photos` (text[]): Массив URL дополнительных фотографий профиля.
- `updated_at` (timestamp): Время последнего обновления.

### Миграция
Предлагаемые изменения в схеме. **Команда для выполнения в Supabase SQL Editor:**

```sql
-- Создание таблицы профилей
CREATE TABLE IF NOT EXISTS public.user_profiles (
    user_id uuid PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    bio text,
    social_links jsonb DEFAULT '{}'::jsonb,
    photos text[] DEFAULT '{}',
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Включение RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Политики доступа
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.user_profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
ON public.user_profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" 
ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Комментарии
COMMENT ON TABLE public.user_profiles IS 'Публичные профили пользователей';
```

## 2. Server Actions (`app/actions/profile.ts`)

Создание новых серверных функций для безопасного обновления данных.

- `updateProfileAction(data)`: Обновление `first_name`, `last_name`, `bio`, `social_links`.
- `updateAvatarAction(url)`: Смена основного фото профиля.
- `addProfilePhotoAction(url)` / `removeProfilePhotoAction(url)`: Управление галереей фото.
- `getUserProfileAction(userId)`: Получение публичных данных пользователя по его ID.

## 3. Пользовательский Интерфейс (UI/UX)

Превращение страницы профиля в современный, настраиваемый хаб.

### Редактирование (`/social` или `/social/edit`)
- Кнопка "Редактировать" на главной странице Social.
- Модальное окно или отдельная страница редактирования.
- Поля ввода для имени, фамилии, БИО.
- Секция ссылок: иконка соцсети + поле для ввода ника/ссылки.
- Загрузка фото через Supabase Storage.

### Визуальные улучшения
Мы будем использовать современные принципы дизайна, ориентированные на iOS 17 и Telegram:
- **Glassmorphism**: Использование `backdrop-blur` и полупрозрачных фонов для карточек.
- **Интерактивность**: Микро-анимации на `framer-motion` при открытии редактирования и переключении вкладок.
- **Сетка фотографий**: Если добавлено несколько фото, они отображаются в виде "Историй" или горизонтального скролла с индикаторами.
- **Социальные кнопки**: Стильные иконки с цветовыми акцентами соответствующих платформ (синий для Telegram, розовый градиент для Instagram).
- **Sticky Header**: Компактный заголовок, который остается сверху при скролле.

## 4. Публичные профили (`/profile/[id]`)

Создание страницы, которую видят другие пользователи.

- URL вида `abundance-effect.vercel.app/profile/UUID`.
- Отображение: Фото, Имя, Уровень, БИО, Соцсети.
- Кнопки взаимодействия (если применимо): "Написать в Telegram", "Посмотреть команду".
- Скрытие приватной информации (баланс кошелька, настройки реинвеста).

## 5. Интеграция

- Вкладка **"Моя команда"** (`/referral`): Сделать карточки участников кликабельными, ведущими на `/profile/[id]`.
- Вкладка **"Лид"**: Клик по лидеру ведет на его профиль.
- Поиск пользователей (в будущем).

## План реализации (по шагам)

1. **DB**: Выполнить миграцию.
2. **Types**: Обновить `DbUser` в `types/index.ts`.
3. **Actions**: Создать `app/actions/profile.ts`.
4. **Storage**: Настроить бакет для фото (если еще нет).
5. **UI (Edit)**: Реализовать форму редактирования в `/social`.
6. **UI (Public)**: Создать страницу `/profile/[id]`.
7. **Linking**: Подключить переходы из реферальной программы.
