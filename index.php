<?php
$frontendDist = __DIR__ . '/frontend/dist/index.html';

if (file_exists($frontendDist)) {
    $content = file_get_contents($frontendDist);
    // Transform relative paths so WAMP root loads dist assets directly
    $content = str_replace('src="./assets/', 'src="frontend/dist/assets/', $content);
    $content = str_replace('href="./assets/', 'href="frontend/dist/assets/', $content);
    echo $content;
    exit;
} else {
    header('Location: backend/public/api');
    exit;
}