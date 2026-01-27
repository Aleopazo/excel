#!/usr/bin/env python3
import datetime
import os
import smtplib
import sys
import time
from email.message import EmailMessage
from zoneinfo import ZoneInfo

DEFAULT_MESSAGE = (
    "Hola Eduardo, recuerda pasarme los contratos de monitoreo wise."
)
DEFAULT_SUBJECT = "Recordatorio: contratos de monitoreo wise"
DEFAULT_TIMES = "09:00,13:00,17:00"


def parse_recipients(raw):
    return [item.strip() for item in raw.split(",") if item.strip()]


def parse_times(raw):
    times = []
    for item in raw.split(","):
        item = item.strip()
        if not item:
            continue
        if ":" not in item:
            raise ValueError(
                f"Hora invalida '{item}'. Usa formato HH:MM 24h."
            )
        hour_str, minute_str = item.split(":", 1)
        try:
            hour = int(hour_str)
            minute = int(minute_str)
        except ValueError as exc:
            raise ValueError(
                f"Hora invalida '{item}'. Usa numeros en HH:MM."
            ) from exc
        if not (0 <= hour <= 23 and 0 <= minute <= 59):
            raise ValueError(
                f"Hora invalida '{item}'. Rango 00:00-23:59."
            )
        times.append((hour, minute))
    if not times:
        raise ValueError("No hay horarios en MESSAGE_TIMES.")
    return sorted(set(times))


def get_bool_env(name, default=False):
    raw = os.getenv(name)
    if raw is None:
        return default
    return raw.strip().lower() in {"1", "true", "yes", "y", "on"}


def next_run_time(now, times, tz):
    candidate = None
    for hour, minute in times:
        run_at = datetime.datetime(
            now.year, now.month, now.day, hour, minute, tzinfo=tz
        )
        if run_at <= now:
            run_at += datetime.timedelta(days=1)
        if candidate is None or run_at < candidate:
            candidate = run_at
    return candidate


def sleep_until(target, tz):
    while True:
        now = datetime.datetime.now(tz)
        remaining = (target - now).total_seconds()
        if remaining <= 0:
            return
        time.sleep(min(60, remaining))


def build_message(config):
    msg = EmailMessage()
    msg["From"] = config["from_email"]
    msg["To"] = ", ".join(config["recipients"])
    msg["Subject"] = config["subject"]
    msg.set_content(config["message_text"])
    return msg


def send_message(config):
    msg = build_message(config)
    if config["dry_run"]:
        print("[DRY_RUN] Enviaria el mensaje:")
        print(msg)
        return
    with smtplib.SMTP(config["smtp_host"], config["smtp_port"]) as server:
        if config["smtp_starttls"]:
            server.starttls()
        if config["smtp_username"]:
            server.login(config["smtp_username"], config["smtp_password"])
        server.send_message(msg)


def load_config():
    tz_name = os.getenv("TIMEZONE", "America/Mexico_City")
    try:
        tz = ZoneInfo(tz_name)
    except Exception as exc:
        raise ValueError(
            f"TIMEZONE invalido '{tz_name}'. Usa un nombre de zona valido."
        ) from exc

    recipients = parse_recipients(os.getenv("EMAIL_TO", ""))
    if not recipients:
        raise ValueError("Falta EMAIL_TO con el correo de Eduardo.")

    smtp_host = os.getenv("SMTP_HOST")
    if not smtp_host:
        raise ValueError("Falta SMTP_HOST.")

    smtp_port_raw = os.getenv("SMTP_PORT", "587")
    try:
        smtp_port = int(smtp_port_raw)
    except ValueError as exc:
        raise ValueError(
            f"SMTP_PORT invalido '{smtp_port_raw}'."
        ) from exc

    smtp_username = os.getenv("SMTP_USERNAME", "")
    smtp_password = os.getenv("SMTP_PASSWORD", "")
    if smtp_username and not smtp_password:
        raise ValueError("Falta SMTP_PASSWORD.")

    from_email = os.getenv("SMTP_FROM") or smtp_username
    if not from_email:
        raise ValueError("Falta SMTP_FROM (o SMTP_USERNAME).")

    message_text = os.getenv("MESSAGE_TEXT", DEFAULT_MESSAGE)
    subject = os.getenv("SUBJECT", DEFAULT_SUBJECT)
    times = parse_times(os.getenv("MESSAGE_TIMES", DEFAULT_TIMES))

    return {
        "tz": tz,
        "recipients": recipients,
        "smtp_host": smtp_host,
        "smtp_port": smtp_port,
        "smtp_username": smtp_username,
        "smtp_password": smtp_password,
        "smtp_starttls": get_bool_env("SMTP_STARTTLS", True),
        "from_email": from_email,
        "message_text": message_text,
        "subject": subject,
        "times": times,
        "dry_run": get_bool_env("DRY_RUN", False),
    }


def main():
    try:
        config = load_config()
    except ValueError as exc:
        print(f"Error de configuracion: {exc}", file=sys.stderr)
        return 1

    tz = config["tz"]
    print("Recordatorios activos. Horarios:", config["times"])
    while True:
        now = datetime.datetime.now(tz)
        next_time = next_run_time(now, config["times"], tz)
        wait_seconds = (next_time - now).total_seconds()
        print(
            f"Siguiente envio: {next_time.isoformat()} "
            f"(en {int(wait_seconds)}s)"
        )
        sleep_until(next_time, tz)
        try:
            send_message(config)
            print("Mensaje enviado.")
        except Exception as exc:
            print(f"Fallo el envio: {exc}", file=sys.stderr)


if __name__ == "__main__":
    raise SystemExit(main())
