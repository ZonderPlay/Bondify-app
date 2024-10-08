# Базовый образ для Rust
FROM rust:1.73-slim AS builder

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /usr/src/app

# Копируем файлы Cargo.toml и Cargo.lock (если есть)
COPY Cargo.toml Cargo.lock ./

# Создаем пустую папку src для кэширования зависимостей
RUN mkdir src

# Собираем зависимости отдельно для кэширования
RUN cargo build --release
RUN rm -rf src

# Копируем оставшиеся исходные файлы
COPY . .

# Собираем приложение в режиме release
RUN cargo build --release

# Используем минимальный образ для запуска
FROM debian:buster-slim AS runner

# Копируем бинарный файл из предыдущего этапа сборки
COPY --from=builder /usr/src/app/target/release/Bondify /usr/local/bin/Bondify

# Открываем порт 8080 (или другой, который использует приложение)
EXPOSE 8080

# Запускаем приложение
CMD ["Bondify"]
