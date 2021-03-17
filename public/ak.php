<?php

// header('Access-Control-Allow-Origin: http://lostcad.fl0w3rs.dev/');
header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN'] );

// if(strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') die();

header('Content-Type: application/json');
echo json_encode(['status' => isset($_COOKIE['ips4_login_key']) ? 'success' : 'fail', 'auth_key' => $_COOKIE['ips4_login_key']]);