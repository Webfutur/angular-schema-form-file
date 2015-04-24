<?php
$file = $_FILES['file'];
$index = $_POST['index'];



$token = md5_file($file['tmp_name']);
$size = filesize($file['tmp_name']);

$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);



$dest = 'uploads/' . $token;

rename( $file['tmp_name'] , $dest );

header('Content-Type: application/json');

echo json_encode(array(
    'token' => $token,
    'index' => $index,
    'size' => $size,
    'mimeType' => $mimeType
));