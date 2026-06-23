# RushSkins — Трекер задач

## ✅ Сделано
- [x] Telegram бот — /start, /about, WebApp кнопка
- [x] Frontend — базовый UI (Home, Market, Profile, навигация)
- [x] Tapper механика (энергия, XP, анимации)
- [x] Деплой бэкенда на Railway
- [x] Деплой фронтенда на Vercel
- [x] PostgreSQL база данных на Railway
- [x] Auth модуль — авторизация через Telegram initData + JWT
- [x] Таблица users создана в БД
- [x] Фронт подключён к бэкенду (VITE_API_BASE)
- [x] Реальный пользователь загружается из БД (убран demo-user)
- [x] ProfilePage — навигационные кнопки
- [x] EditProfilePage — редактирование никнейма, BIO, приватность, аватар
- [x] AppSettingsPage — UI готов (темы, язык — заглушки)
- [x] .cursorrules — дизайн-система для Cursor
- [x] TODO.md — трекер задач

---

## 🔴 Высокий приоритет

### БД — обновить схему под новую концепцию
- [ ] Добавить поле tickets (Int) в таблицу users
- [ ] Добавить поле faction (Enum) в таблицу users
- [ ] Создать таблицу Case (id, name, imageUrl, price, isActive)
- [ ] Создать таблицу CaseItem (caseId, skinId, dropWeight)
- [ ] Создать таблицу Skin (id, name, weapon, wear, rarity, price, imageUrl, float, lisSkinId)
- [ ] Создать таблицу UserInventory (userId, skinId, status: held/sold/traded, soldForRc)
- [ ] Создать таблицу CaseOpen (userId, caseId, skinId, ticketsEarned, openedAt)
- [ ] Создать таблицу Transaction (userId, type: deposit/spend/sell, amount, currency: rc/tickets)
- [ ] Создать таблицу Raffle (id, type: daily/weekly, prize, ticketCost, endsAt, winnersCount)
- [ ] Создать таблицу RaffleEntry (raffleId, userId, ticketsSpent)
- [ ] Создать таблицу Season (id, startAt, endAt, isActive)
- [ ] Создать таблицу SeasonScore (seasonId, userId, totalDropValue)
- [ ] Создать таблицу Challenge (id, challengerId, opponentId, ticketStake, status, endsAt)
- [ ] Создать таблицу Faction (id, name, color)
- [ ] Создать таблицу FactionScore (factionId, weekStart, totalDropValue)

### Бэкенд — новые модули
- [ ] Users модуль — PATCH /api/users/me (сохранение никнейма, BIO, tradeUrl в БД)
- [ ] Cases модуль — GET /api/cases, POST /api/cases/:id/open (алгоритм дропа, начисление тикетов)
- [ ] Inventory модуль — GET /api/inventory, POST /api/inventory/:id/sell (70% RC), POST /api/inventory/:id/trade
- [ ] Payments модуль — POST /api/payments/invoice, webhook successful_payment → начислить RC
- [ ] Raffles модуль — GET /api/raffles, POST /api/raffles/:id/enter, крон для определения победителей
- [ ] Leaderboard модуль — GET /api/leaderboard/all-time, GET /api/leaderboard/season
- [ ] Challenges модуль — POST /api/challenges, GET /api/challenges/:id
- [ ] Factions модуль — GET /api/factions, POST /api/factions/join

### Фронтенд — новые страницы
- [ ] HomePage — полный редизайн (лента дропов, RC+тикеты, задания, розыгрыши, анонсы)
- [ ] CasesPage — каталог кейсов по ценам, рулетка открытия, анимация дропа
- [ ] ArenaPage — три режима: Upgrade, Battle, Contracts
- [ ] LeaderboardPage — постоянный + сезонный рейтинг, челленджи, фракции
- [ ] ProfilePage — обновить баланс (RC + тикеты), добавить инвентарь скинов

### Навигация
- [ ] Переименовать вкладки: Home, Cases, Arena, Leaderboard, Profile
- [ ] Обновить иконки навигации под новые страницы
- [ ] Убрать старую MarketPage из навигации (переехала в Cases или отдельно)

---

## 🟡 Средний приоритет

### Кейсы
- [ ] Анимация рулетки при открытии кейса
- [ ] Бонус тикеты за Classified+ (+5) и Covert (+20) дропы
- [ ] Таблица цен кейсов и тикетов: до $1→1т, $1-$5→3т, $5+→10т

### Arena
- [ ] Upgrade — алгоритм шанса улучшения (чем выше редкость тем ниже шанс)
- [ ] Battle — матчмейкинг, комната ожидания, таймер
- [ ] Contracts — выбор N скинов одной редкости → дроп следующей редкости

### Leaderboard
- [ ] Сезонный сброс — крон 1-го числа каждого месяца
- [ ] Призы топ-3 сезона — автоматическая выдача
- [ ] Челленджи — логика 24 часа, определение победителя
- [ ] Фракции — еженедельный бонус RC победившей фракции

### Профиль
- [ ] Инвентарь — продажа скина за 70% RC
- [ ] Инвентарь — отправка трейда в Steam по trade URL
- [ ] Сохранение никнейма/BIO/tradeUrl в БД (сейчас только локальный store)

---

## ⚪ Низкий приоритет (после запуска)

- [ ] Светлая тема — прописать CSS переменные на всех компонентах
- [ ] Смена языка RU/EN — подключить react-i18next
- [ ] Steam авторизация (OpenID)
- [ ] Faceit авторизация
- [ ] История транзакций на странице профиля
- [ ] Daily check-in → бэкенд (стрик, запись в БД)
- [ ] Push уведомления через Telegram (трейд отправлен, выиграл розыгрыш)
- [ ] Админ-панель: управление кейсами, скинами, розыгрышами
- [ ] LisSkins API — реальные скины вместо моков

---

## 📝 Концепция (зафиксировано)

### Валюты
- **RC (Rush Coins)** — основная валюта. Пополняется через Telegram Stars или таппером.
  Вывести нельзя — только внутри приложения.
- **Тикеты** — зарабатываются при открытии кейсов. Тратятся на розыгрыши и челленджи.

### Тикеты за открытие кейса
- Кейс до $1 → 1 тикет
- Кейс $1–$5 → 3 тикета
- Кейс $5+ → 10 тикетов
- Бонус: Classified+ → +5 тикетов, Covert → +20 тикетов

### Продажа скина
- 70% от рыночной цены в RC

### Рейтинг
- Постоянный: сумма стоимости всех выбитых скинов за всё время
- Сезонный: сумма стоимости выбитых скинов за текущий месяц (сброс 1-го числа)
- Топ-3 сезона получают призы (скин, тикеты, RC бонус)

### Розыгрыши
- Дейли: 5 тикетов, несколько победителей, приз — скин из пула
- Недельный: 20 тикетов, больше победителей, дорогой скин

### Фракции
- 3–4 команды, игрок выбирает при регистрации
- Еженедельно фракция с наибольшей суммой дропов получает бонус RC всем участникам

### Челленджи
- Бросаешь вызов игроку рядом по рейтингу
- Оба ставят тикеты, 24 часа — кто выбьет скинов на большую сумму побеждает
- Победитель забирает тикеты соперника

### Страницы
1. 🏠 Home — лента дропов, RC+тикеты, задания, розыгрыши, анонсы
2. 📦 Cases — каталог кейсов, рулетка, дропы
3. ⚔️ Arena — Upgrade, Battle, Contracts
4. 🏆 Leaderboard — рейтинг, сезон, челленджи, фракции
5. 👤 Profile — баланс, инвентарь, настройки

### Технический стек
- Frontend: React + TypeScript + Vite + Tailwind → Vercel
- Backend: NestJS + TypeORM + PostgreSQL → Railway
- Bot: Telegraf (index.js)
- БД: PostgreSQL на Railway (synchronize:true в dev → миграции перед продом)
- LisSkins API — подключать когда будем делать трейды
