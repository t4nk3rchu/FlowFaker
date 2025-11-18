import locale

FAKER_LOCALE_MAP = {
    "en": "en_US",
    "en_US": "en_US",
    "en_GB": "en_GB",
    "fr": "fr_FR",
    "de": "de_DE",
    "it": "it_IT",
    "es": "es_ES",
    "pt": "pt_PT",
    "pt_BR": "pt_BR",
    "zh": "zh_CN",
    "zh_CN": "zh_CN",
    "zh_TW": "zh_TW",
    "ja": "ja_JP",
    "ko": "ko_KR",
}

def get_default_locale() -> str:
    try:
        loc = locale.getdefaultlocale()[0]
    except Exception:
        loc = "en_US"
    return FAKER_LOCALE_MAP.get(loc, "en_US")

def to_lang(code: str) -> str:
    if not code:
        return "en"
    return code.split("_")[0]

def normalize(code: str) -> str:
    return FAKER_LOCALE_MAP.get(code, code or "en_US")