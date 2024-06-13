LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "debug": {
            "level": "DEBUG",
            "class": "logging.FileHandler",
            "filename": "logs/debug.log",
        },
        "printers_update": {
            "level": "INFO",
            "class": "logging.FileHandler",
            "filename": "logs/printers_update.log",
        },
    },
    "formatters": {
        "simple": {
            "format": "{asctime} {levelname} >> {message}",
            "style": "}",
        }
    },
    "loggers": {
        "printers_update": {
            "handlers": ["printers_update"],
            "propagate": False,
        }
    },
}
