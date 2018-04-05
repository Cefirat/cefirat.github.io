<?php
/**
 * Основные параметры WordPress.
 *
 * Скрипт для создания wp-config.php использует этот файл в процессе
 * установки. Необязательно использовать веб-интерфейс, можно
 * скопировать файл в "wp-config.php" и заполнить значения вручную.
 *
 * Этот файл содержит следующие параметры:
 *
 * * Настройки MySQL
 * * Секретные ключи
 * * Префикс таблиц базы данных
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** Параметры MySQL: Эту информацию можно получить у вашего хостинг-провайдера ** //
/** Имя базы данных для WordPress */
define('DB_NAME', 'dentissimo');

/** Имя пользователя MySQL */
define('DB_USER', 'root');

/** Пароль к базе данных MySQL */
define('DB_PASSWORD', '');

/** Имя сервера MySQL */
define('DB_HOST', 'localhost');

/** Кодировка базы данных для создания таблиц. */
define('DB_CHARSET', 'utf8mb4');

/** Схема сопоставления. Не меняйте, если не уверены. */
define('DB_COLLATE', '');

/**#@+
 * Уникальные ключи и соли для аутентификации.
 *
 * Смените значение каждой константы на уникальную фразу.
 * Можно сгенерировать их с помощью {@link https://api.wordpress.org/secret-key/1.1/salt/ сервиса ключей на WordPress.org}
 * Можно изменить их, чтобы сделать существующие файлы cookies недействительными. Пользователям потребуется авторизоваться снова.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'G>ap*BM6oJg2MY|2{!0bu3E|O~A]X<{3/yLjiF|ZW#.3RUVYZFK>);`)d7U9^Loa');
define('SECURE_AUTH_KEY',  'O_J94+rK]N.@lkgMtz7z`?TQ _!!Y)OA& e2ce(I7ywYDVT/,0tU7|J1rQ?h-)UI');
define('LOGGED_IN_KEY',    '##CaIw#sRo$~#?fxKU1w5:/~70xO^8#Z($U~vzw@FFoUrWS)#_xe6sQIYw#r0Mct');
define('NONCE_KEY',        '7/nTjD8$n&z2Msi|s{(aaa*`z4j1m1TwE.-Jx<Y7|YE?03iFVzC!&4=_mIK>/SH?');
define('AUTH_SALT',        'VupJ*^ww*42xOak$4!!G5A-qCybB]|q#u7wO~@(96n]+qe&R+|S)0vqi@]X%d%H}');
define('SECURE_AUTH_SALT', 'JUn9[Po6BGcH&S5Q&@xj{vh3B*4ky?W|/ZsT+t_C6giYhW?(ZKq]%p6s &XeQys ');
define('LOGGED_IN_SALT',   '^hdvB_0--?:`@~mi-^%?Vz0?9>MIGf!|L$+.KIHj^L<_{H5VYX}IB2(zE8C<I4nR');
define('NONCE_SALT',       '5#$K^Li*#(%o7, &w*vDB-uL~igPP@{z;mG`?[tSNlB;g9Y8.lH~^1)P*Y,S1hUa');

/**#@-*/

/**
 * Префикс таблиц в базе данных WordPress.
 *
 * Можно установить несколько сайтов в одну базу данных, если использовать
 * разные префиксы. Пожалуйста, указывайте только цифры, буквы и знак подчеркивания.
 */
$table_prefix  = 'dent_';

/**
 * Для разработчиков: Режим отладки WordPress.
 *
 * Измените это значение на true, чтобы включить отображение уведомлений при разработке.
 * Разработчикам плагинов и тем настоятельно рекомендуется использовать WP_DEBUG
 * в своём рабочем окружении.
 *
 * Информацию о других отладочных константах можно найти в Кодексе.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* Это всё, дальше не редактируем. Успехов! */

/** Абсолютный путь к директории WordPress. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Инициализирует переменные WordPress и подключает файлы. */
require_once(ABSPATH . 'wp-settings.php');
