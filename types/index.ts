export type DbUser = {
    id: string;
    telegram_id: number | null;
    username: string | null;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    phone_number: string | null;
    created_at: string;
    wallet_balance: number;
    aicore_balance: number;
    level: number;
    reinvest_setup: number;
    referrer_id: number | null;
};
