<?php
// Nimmt das Kontaktformular von /kontakt/ entgegen und schickt es per E-Mail an den
// Club. Das Script speichert weder die Nachricht noch IP-Adressen.

const RECIPIENT = 'toeffclub@gmail.com';
const SENDER = 'website@pudgilly.ch';
const ALLOWED_ORIGINS = ['https://pudgilly.ch', 'https://www.pudgilly.ch'];
const MAX_MAILS_PER_HOUR = 30;

ini_set('display_errors', '0');

function finish($status)
{
    header('Location: /kontakt/#' . $status, true, 303);
    exit;
}

// Eine Zeile ohne Steuerzeichen, damit nichts in die Kopfzeilen der E-Mail gelangt.
function clean_line($value, $maxBytes)
{
    $text = preg_replace('/\p{C}+/u', ' ', is_string($value) ? $value : '');
    $text = trim((string) preg_replace('/\s+/u', ' ', (string) $text));
    return strlen($text) > $maxBytes ? '' : $text;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Location: /kontakt/', true, 303);
    exit;
}

// Formulare von fremden Seiten ablehnen. Manche Browser senden keinen Origin-Kopf,
// dann entscheidet der Referer.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$referer = $_SERVER['HTTP_REFERER'] ?? '';
$refererOrigin = implode('/', array_slice(explode('/', $referer), 0, 3));
if (!in_array($origin !== '' ? $origin : $refererOrigin, ALLOWED_ORIGINS, true)) {
    finish('fehler');
}

// Honeypot: Bots sehen die normale Bestätigung, es geht aber keine E-Mail raus.
if (!empty($_POST['botcheck'])) {
    finish('gesendet');
}

$name = clean_line($_POST['name'] ?? '', 200);
$email = clean_line($_POST['email'] ?? '', 200);
$topic = clean_line($_POST['subject'] ?? '', 100);
$message = is_string($_POST['message'] ?? null) ? str_replace("\r\n", "\n", $_POST['message']) : '';
$message = trim((string) preg_replace('/[^\P{C}\n\t]+/u', ' ', $message));

if ($name === '' || $message === '' || strlen($message) > 10000 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    finish('fehler');
}

// Obergrenze pro Stunde, damit das Script nicht das Postfach fluten kann. Ist die
// Datei nicht beschreibbar, läuft der Versand ohne Grenze weiter.
$counterFile = sys_get_temp_dir() . '/pudgilly-kontakt.txt';
$hour = date('YmdH');
$saved = explode(' ', (string) @file_get_contents($counterFile));
$count = ($saved[0] === $hour ? (int) ($saved[1] ?? 0) : 0) + 1;
@file_put_contents($counterFile, "$hour $count", LOCK_EX);
if ($count > MAX_MAILS_PER_HOUR) {
    finish('fehler');
}

// Uhrzeit im Betreff: Gmail fasst sonst E-Mails mit gleichem Betreff zu einer Konversation zusammen.
date_default_timezone_set('Europe/Zurich');
$subject = '=?UTF-8?B?' . base64_encode("Kontakt: $topic ($name), " . date('d.m.Y H:i:s')) . '?=';
$body = "Name: $name\nE-Mail: $email\nBetreff: $topic\n\n"
    . wordwrap($message, 900, "\n", false)
    . "\n\nGesendet von pudgilly.ch/kontakt. Mit «Antworten» schreibst du direkt an diese Person.\n";
$headers = implode("\r\n", [
    'From: Pudgilly Riders Website <' . SENDER . '>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
]);

finish(mail(RECIPIENT, $subject, $body, $headers, '-f' . SENDER) ? 'gesendet' : 'fehler');
