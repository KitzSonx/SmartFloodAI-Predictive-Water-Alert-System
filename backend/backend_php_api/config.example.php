<?php
define('MYSQL_HOST', 'your_host_address'); // เช่น localhost
define('MYSQL_USER', 'your_database_username');
define('MYSQL_PASSWORD', 'YOUR_SECRET_PASSWORD_HERE'); // <--- สำคัญมาก
define('MYSQL_DB', 'your_database_name');

// โค้ดเชื่อมต่อ...
$conn = mysqli_connect(MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
?>