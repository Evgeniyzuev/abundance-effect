-- Add core creation knowledge item to game_items table

INSERT INTO game_items (
    id,
    type,
    title,
    description,
    image,
    subtitle,
    sort_order,
    is_active
) VALUES (
    'core_creation',
    'book',
    'AI Core',
    'Создайте ваш личный AI Core - источник гарантированного дохода и вклада в систему Abundance Effect.',
    '⚡',
    'Источник бесконечного изобилия',
    98,
    true
);
