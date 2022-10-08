# movies-explorer-api

Репозиторий для бэкенда дипломного проекта. Управляет авторизацией. Сохраняет понравившиеся фильмы.

## Эндпоинты

* возвращает информацию о пользователе (email и имя):\
  GET, `/users/me`
* обновляет информацию о пользователе (email и имя):\
  PATCH, `/users/me`
* возвращает все сохранённые текущим пользователем фильмы:\
  GET, `/movies`
* создаёт фильм с переданными в теле данными:\
  POST, `/movies`
* удаляет сохранённый фильм по id:\
  DELETE, `/movies/_id`
