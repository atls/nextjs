# Identity Integration

## BREAKING CHANGE 1.0.0

- Flow экспортируются:
  - `@atls/next-identity-integration/app-router` - для `app` роутера
  - `@atls/next-identity-integration/page-router` - для `pages` роутера

## BREAKING CHANGE 0.2.0

- Переход на `App Router` для `Next.JS@14`

## BREAKING CHANGE 0.0.16

- Необходим глобальный провайдер `KratosClientProvider`. По умолчанию он предоставляет
  стандартный клиент `kratos`, однако его можно изменять/расширять в случае необходимости как и URL редиректа для некоторых ошибок.
- Добавлена кастомизация URL для редиректа в случае ошибок, например пользователь уже авторизован.
- Расширен конструктов класса `KratosClient`

## BREAKING CHANGE 0.0.14

- Обновлены пакеты `ory/kratos-client`, `ory/integrations`, `nextjs`
- Добавлены пропсы `returnToUrl` в провайдеры флоу для фоллбэка

## BREAKING CHANGE 0.0.13

- Хардкод URL переадресации для настроек, регистрации и логина
- Добавлен `identity` для регистрации для вынесения
