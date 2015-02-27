<?php

$file = $_FILES['file'];

$token = md5_file($file['tmp_name']);

$dest = 'uploads/' . $token;

rename( $file['tmp_name'] , $dest );

header('Content-Type: application/json');

echo json_encode(array(
    'token' => $token
));