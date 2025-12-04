-- Создаем таблицу для хранения файлов
CREATE TABLE IF NOT EXISTS t_p36259787_android_call_chat_ap.files (
    id SERIAL PRIMARY KEY,
    message_id INTEGER NOT NULL REFERENCES t_p36259787_android_call_chat_ap.messages(id),
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    file_data BYTEA NOT NULL,
    uploaded_by INTEGER NOT NULL REFERENCES t_p36259787_android_call_chat_ap.users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Добавляем индексы для быстрого поиска
CREATE INDEX idx_files_message_id ON t_p36259787_android_call_chat_ap.files(message_id);
CREATE INDEX idx_files_uploaded_by ON t_p36259787_android_call_chat_ap.files(uploaded_by);

-- Добавляем уникальный индекс на username для быстрого поиска и предотвращения дубликатов
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username_unique ON t_p36259787_android_call_chat_ap.users(username);