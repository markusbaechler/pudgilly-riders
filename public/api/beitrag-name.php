<?php
// Nimmt den Namen von /mitgliederbeitrag/ entgegen und schickt ihn per E-Mail an
// den Club. «TWINT Payments» ist anonym: Die Zuordnung läuft über Zeitpunkt und
// Betrag im RaiseNow Hub. Das Script speichert weder Namen noch IP-Adressen.

const RECIPIENT = 'toeffclub@gmail.com';
const SENDER = 'website@pudgilly.ch';
const ALLOWED_ORIGINS = ['https://pudgilly.ch', 'https://www.pudgilly.ch'];
const MAX_MAILS_PER_HOUR = 60;

ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function respond($status, $success)
{
    http_response_code($status);
    echo json_encode(['success' => $success]);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, false);
}

if (!in_array($_SERVER['HTTP_ORIGIN'] ?? '', ALLOWED_ORIGINS, true)) {
    respond(403, false);
}

$input = json_decode((string) file_get_contents('php://input', false, null, 0, 2048), true);
if (!is_array($input) || !is_string($input['name'] ?? null)) {
    respond(400, false);
}

// Honeypot: Bots erhalten eine normale Antwort, es geht aber keine E-Mail raus.
if (!empty($input['botcheck'])) {
    respond(200, true);
}

// Steuerzeichen entfernen: Der Name landet auch im Betreff der E-Mail.
$name = preg_replace('/\p{C}+/u', ' ', $input['name']);
$name = trim((string) preg_replace('/\s+/u', ' ', (string) $name));
if (strlen($name) > 200 || !preg_match('/^\S+ \S/u', $name)) {
    respond(400, false);
}

// Obergrenze pro Stunde, damit das Script nicht das Postfach fluten kann. Ist die
// Datei nicht beschreibbar, läuft der Versand ohne Grenze weiter.
$counterFile = sys_get_temp_dir() . '/pudgilly-beitrag-name.txt';
$hour = date('YmdH');
$saved = explode(' ', (string) @file_get_contents($counterFile));
$count = ($saved[0] === $hour ? (int) ($saved[1] ?? 0) : 0) + 1;
@file_put_contents($counterFile, "$hour $count", LOCK_EX);
if ($count > MAX_MAILS_PER_HOUR) {
    respond(429, false);
}

date_default_timezone_set('Europe/Zurich');
$subject = '=?UTF-8?B?' . base64_encode("Mitgliederbeitrag: $name") . '?=';
$body = "Name: $name\n"
    . 'Zahlung gestartet: ' . date('d.m.Y, H:i:s') . " Uhr\n\n"
    . "Das ist keine Zahlungsbestätigung. Bitte mit Zeitpunkt und Betrag im RaiseNow Hub abgleichen.\n\n"
    . "Gesendet von pudgilly.ch/mitgliederbeitrag\n";
$headers = implode("\r\n", [
    'From: Pudgilly Riders Website <' . SENDER . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
]);

respond(200, mail(RECIPIENT, $subject, $body, $headers, '-f' . SENDER));
