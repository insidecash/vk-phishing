# Установка

[⬅️ Вернутся на главную](../README.md)

1. Первым делом **установите [node js and npm](https://nodejs.org/en/download/)** если ещё этого не сделали. Я рекомендую последнюю версию 12 LTS

2. Откройте [Страницу с Релизами](https://github.com/xxhax-team/vk-phishing/releases) и **скачайте [Последний Релиз](https://github.com/xxhax-team/vk-phishing/releases/latest)** для вашей ОС:  
   `vk-phishing-win.zip` - Для Windows  
   `vk-phishing-unix.zip` - Для Linux & macOS

3. **Распакуйте** скачанный файл в папку и **откройте её** в проводнике или терминале

4. **Запустите** файл `install.sh` или `install.bat` в зависимости от вашей системы.

## Запуск

**Фишинг запускается файлом** `start.sh` или `start.bat` в зависимости от ОС. После успешного запуска у вас появится консоль с логами. Там будет что-то на подобии:

![Server: http://localhost:3000, NGrock: CONNECTED etc...](./successful-startup.png)

## Настройка

Отредактируйте файл `config.yml`, после этого перезапустите Фишинг. Пожалуйста, не творите херню с файлом конфига, формат очень не любит различия в форматировании. **Все опции в нём прокомментированы, но на английском**. Но есть [Разъяснение их на Русском](./config.ru.md)

## Удаление

Просто удалите папку, в которую распаковывали Фишинг. В ней должен быть файл `config.yml` и папки: `node_modules`, `plugins` и `static`

[⬅️ Вернутся на главную](../README.md)
