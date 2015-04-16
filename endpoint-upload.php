<?php
$file = $_FILES['file'];
$index = $_POST['index'];



$token = md5_file($file['tmp_name']);
$size = filesize($file['tmp_name']);
$extension = substr($file['name'], strrpos($file['name'], '.')+1);



$dest = 'uploads/' . $token;

rename( $file['tmp_name'] , $dest );

header('Content-Type: application/json');

echo json_encode(array(
    'token' => $token,
    'index' => $index,
    'size' => $size,
    'extension' => $extension
));