# Используем официальный образ Node.js как базовый
FROM node:16

# Устанавливаем рабочую директорию в контейнере
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json (или yarn.lock) в рабочую директорию
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь код в рабочую директорию
COPY . .

# Открываем порт, на котором будет работать приложение
EXPOSE 5000

# Команда для запуска приложения
CMD ["npm", "start"]