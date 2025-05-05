# LPTsk KVN - Современная платформа для управления КВН

![Nuxt.js](https://img.shields.io/badge/Nuxt.js-3.x-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🚀 О проекте

LPTSK KVN - это современная веб-платформа, разработанная для управления и организации мероприятий КВН. Проект построен на передовых технологиях и предоставляет удобный интерфейс для администраторов и пользователей.

## ✨ Основные возможности

- 🎭 Управление командами и участниками
- 📅 Планирование и организация мероприятий
- 📊 Аналитика и статистика
- 🎨 Современный адаптивный интерфейс
- 🔐 Безопасная аутентификация через VK
- 📱 Поддержка мобильных устройств

## 🛠 Технологический стек

- **Frontend Framework:** Nuxt.js 3
- **UI Framework:** Vue.js 3
- **Стилизация:** TailwindCSS
- **Графики:** Chart.js
- **Загрузка файлов:** FilePond
- **Диаграммы Ганта:** Frappe Gantt
- **Аутентификация:** VK SDK
- **Уведомления:** Vue Toastification

## 🚀 Быстрый старт

### Предварительные требования

- Node.js (рекомендуется версия 18.x или выше)
- npm или yarn

### Установка

1. Клонируйте репозиторий:

```bash
git clone [URL репозитория]
cd lptsk_kvn
```

2. Установите зависимости:

```bash
npm install
# или
yarn install
```

3. Запустите проект в режиме разработки:

```bash
npm run dev
# или
yarn dev
```

4. Откройте [http://localhost:3000](http://localhost:3000) в вашем браузере

### Сборка для продакшена

```bash
npm run build
# или
yarn build
```

## 📁 Структура проекта

```
├── assets/          # Статические ресурсы
├── components/      # Vue компоненты
├── layouts/         # Шаблоны страниц
├── middleware/      # Middleware функции
├── pages/          # Страницы приложения
├── plugins/        # Vue плагины
├── public/         # Публичные файлы
├── server/         # Серверная часть
└── utils/          # Вспомогательные функции
```

## 🔧 Конфигурация

Проект использует следующие основные конфигурационные файлы:

- `nuxt.config.ts` - конфигурация Nuxt.js
- `tailwind.config.cjs` - конфигурация TailwindCSS
- `tsconfig.json` - конфигурация TypeScript
