# Recordatorios de contratos de monitoreo

Aplicacion en Python que envia un mensaje 3 veces al dia a Eduardo para
recordarle que te pase los contratos de monitoreo wise.

## Requisitos

- Python 3.9+ (para `zoneinfo`)
- Acceso SMTP (correo saliente)

## Configuracion

Copia `.env.example` a `.env` y completa los valores:

```bash
cp .env.example .env
```

Variables principales:

- `EMAIL_TO`: correo de Eduardo (puedes usar varios separados por coma).
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_FROM`.
- `MESSAGE_TIMES`: horarios en formato 24h (por defecto 09:00,13:00,17:00).
- `TIMEZONE`: zona horaria (por defecto America/Mexico_City).

## Uso

Exporta las variables del archivo `.env` y ejecuta:

```bash
set -a && source .env && set +a
python app.py
```

Para probar sin enviar correo real:

```bash
DRY_RUN=1 python app.py
```

## Notas

Esta app corre en bucle y enviara un correo en cada horario configurado.
Si quieres ejecutarlo como servicio, puedes usar systemd, Docker o un
job de supervisión externo.
