import sys
import os
from pathlib import Path
plugindir = Path(__file__).parent.absolute()
paths = (".", "lib", "plugin")
sys.path = [str(plugindir / p) for p in paths] + sys.path
from pyflowlauncher import Plugin, Result, send_results
from pyflowlauncher.result import ResultResponse
from faker import Faker
import pyperclip
from pyflowlauncher import api as FlowApi
import time
import json
from src import internet, finance, person, date, location, lorem, phone, random, vehicle
from src.i18n import t
from src.locale_support import get_default_locale, to_lang, normalize

plugin = Plugin()
current_locale = get_default_locale()
fake = Faker(current_locale)

SUGGESTION_CACHE: dict[str, list[str]] = {
    "categories": [
        "date",
        "finance",
        "internet",
        "location",
        "lorem",
        "person",
        "random",
        "vehicle",
        "phone",
    ],
    "date": [
        "faker date anytime",
        "faker date between from:YYYY-MM-DD|today to:YYYY-MM-DD|today",
        "faker date between from:-{n}y|M|d to:+{n}y|M|d",
        "faker date birthdate mode:age min:{n} max:{n}",
        "faker date birthdate mode:year min:{n} max:{n}",
    ],
    "finance": [
        "faker finance accountName",
        "faker finance accountNumber length:{n}",
        "faker finance creditCardCVV",
        "faker finance creditCardNumber",
    ],
    "internet": [
        "faker internet displayName first:{firstName} last:{lastName}",
        "faker internet domainName",
        "faker internet email first:{firstName} last:{lastName}",
        "faker internet ipv4",
        "faker internet ipv6",
        "faker internet username first:{firstName} last:{lastName}",
        "faker internet password length:{n}",
        "faker internet url",
    ],
    "location": [
        "faker location streetAddress",
        "faker location state",
        "faker location city",
    ],
    "lorem": [
        "faker lorem words length:{n}",
        "faker lorem slug length:{n}",
        "faker lorem sentence length:{n}",
        "faker lorem paragraph length:{n}",
    ],
    "person": [
        "faker person fullName sex:male|female",
        "faker person firstName sex:male|female",
        "faker person lastName sex:male|female",
        "faker person middleName",
        "faker person jobTitle",
        "faker person bio",
        "faker person name first last",
        "faker person name last first lang:{language}",
        "faker person name last middle first lang:{language}",
    ],
    "random": [
        "faker random uuid4",
        "faker random ean13",
        "faker random ean8",
        "faker random imageUrl width:{n} height:{n}",
        "faker random image width:{n} height:{n}",
    ],
    "vehicle": [
        "faker vehicle license",
        "faker vehicle vin",
    ],
    "phone": [
        "faker phone number lang:{lang}",
    ],
}

CATEGORY_DESCRIPTIONS: dict[str, str] = {
    "date": "Generate dates and birthdates",
    "finance": "Generate account names/numbers and card data",
    "internet": "Generate emails, usernames, domains, IPs, passwords",
    "location": "Generate street addresses, states, cities",
    "lorem": "Generate words, slugs, sentences, paragraphs",
    "person": "Generate names, job titles, bios",
    "random": "Generate UUIDs, EANs, images, URLs",
    "vehicle": "Generate license plates and VINs",
    "phone": "Generate phone numbers and IMEIs",
}

COMMAND_DESCRIPTIONS: dict[str, str] = {
    "faker date anytime": "Random date",
    "faker date between from:YYYY-MM-DD|today to:YYYY-MM-DD|today": "Date between two absolute dates",
    "faker date between from:-{n}y|M|d to:+{n}y|M|d": "Date between two relative offsets",
    "faker date birthdate mode:age min:{n} max:{n}": "Birthdate by age range",
    "faker date birthdate mode:year min:{n} max:{n}": "Birthdate by year range",

    "faker finance accountName": "Account name",
    "faker finance accountNumber length:{n}": "Account number of given length",
    "faker finance creditCardCVV": "Credit card CVV",
    "faker finance creditCardNumber": "Credit card number",

    "faker internet displayName first:{firstName} last:{lastName}": "Display name",
    "faker internet domainName": "Domain name",
    "faker internet email first:{firstName} last:{lastName}": "Email address",
    "faker internet ipv4": "IPv4 address",
    "faker internet ipv6": "IPv6 address",
    "faker internet username first:{firstName} last:{lastName}": "Username",
    "faker internet password length:{n}": "Password",
    "faker internet url": "URL",

    "faker location streetAddress": "Street address",
    "faker location state": "State name",
    "faker location city": "City name",

    "faker lorem words length:{n}": "Words",
    "faker lorem slug length:{n}": "Slug from words",
    "faker lorem sentence length:{n}": "Sentence",
    "faker lorem paragraph length:{n}": "Paragraph",

    "faker person fullName sex:male|female": "Full name",
    "faker person firstName sex:male|female": "First name",
    "faker person lastName sex:male|female": "Last name",
    "faker person jobTitle": "Job title",
    "faker person bio": "Short bio",
    "faker person name first last": "Ordered name (e.g. first last)",
    "faker person name last first lang:{language}": "Ordered with language",
    "faker person name last middle first lang:{language}": "Ordered with middle and language",

    "faker random uuid4": "UUID v4",
    "faker random ean13": "EAN-13 barcode",
    "faker random ean8": "EAN-8 barcode",
    "faker random imageUrl width:{n} height:{n}": "Placeholder image URL",
    "faker random image width:{n} height:{n}": "Generated image path",

    "faker vehicle license": "Vehicle license plate",
    "faker vehicle vin": "Vehicle VIN",

    "faker phone number lang:{language}": "Phone number",
}

def describe_command(cmd: str) -> str:
    s = COMMAND_DESCRIPTIONS.get(cmd)
    if s:
        return s
    if cmd.startswith("faker finance accountNumber length:"):
        return "Account number of given length"
    if cmd.startswith("faker internet password length:"):
        return "Password"
    if cmd.startswith("faker lorem words length:"):
        return "Words"
    if cmd.startswith("faker lorem slug length:"):
        return "Slug from words"
    if cmd.startswith("faker lorem sentence length:"):
        return "Sentence"
    if cmd.startswith("faker lorem paragraph length:"):
        return "Paragraph"
    if cmd.startswith("faker internet displayName first:"):
        return "Display name"
    if cmd.startswith("faker internet email first:"):
        return "Email address"
    if cmd.startswith("faker internet username first:"):
        return "Username"
    if cmd.startswith("faker date between from:-") and " to:+" in cmd:
        return "Date between two relative offsets"
    return cmd

def is_command_complete_and_valid(category: str, subtype: str, opts: dict, raw_query: str) -> bool:
    if not category or not subtype:
        return False
    if category == "date":
        if subtype == "between":
            f = opts.get("from")
            t = opts.get("to")
            if not f or not t:
                return False
            def is_placeholder(x: str) -> bool:
                return ("|" in x) or ("YYYY" in x) or ("MM" in x) or ("DD" in x)
            if is_placeholder(f) or is_placeholder(t):
                return False
            return True
        if subtype in {"birthdate", "birtdate"}:
            mode = (opts.get("mode") or "").lower()
            if mode not in {"age", "year"}:
                return False
            return bool(opts.get("min")) and bool(opts.get("max"))
    if category == "person" and subtype == "name":
        parts = raw_query.split()
        try:
            idx = parts.index("name")
        except ValueError:
            return False
        after = [p for p in parts[idx+1:] if ":" not in p]
        if len(after) < 2:
            return False
        allowed = {"first", "last", "middle"}
        if not all(p.lower() in allowed for p in after[:3]):
            return False
        return True
    return True

LAST_SUGGEST_QUERY = ""
LAST_SUGGEST_TIME = 0.0

def format_values(values: list[str], newline: bool) -> str:
    return ("\n" if newline else ", ").join(values)

def parse_options(tokens: list[str]) -> dict:
    opts = {}
    for p in tokens:
        if ":" in p:
            k, v = p.split(":", 1)
            opts[k.lower()] = v
        elif p.lower() in {"newline", "nl"}:
            opts["newline"] = True
    return opts

def resolve_category_provider(tokens: list[str]) -> tuple[str, str, list[str]]:
    if not tokens:
        return "", "", []
    category = tokens[0]
    subtype = tokens[1] if len(tokens) > 1 else ""
    rest = tokens[2:] if len(tokens) > 2 else []
    return category, subtype, rest

def suggestion_results_for_categories(lang: str) -> list[Result]:
    global LAST_SUGGEST_TIME, LAST_SUGGEST_QUERY
    now = time.monotonic()
    if LAST_SUGGEST_QUERY != "__categories__" or now - LAST_SUGGEST_TIME < 0.2:
        time.sleep(0.25)
    LAST_SUGGEST_QUERY = "__categories__"
    LAST_SUGGEST_TIME = time.monotonic()
    items = []
    for cat in SUGGESTION_CACHE["categories"]:
        q = f"faker {cat} "
        items.append(Result(
            Title=cat,
            SubTitle=CATEGORY_DESCRIPTIONS.get(cat, cat),
            IcoPath="Images\\app.svg",
            JsonRPCAction=FlowApi.change_query(q, True),
        ))
    return items

def suggestion_results_for_subtypes(lang: str, category: str, prefix: str) -> list[Result]:
    global LAST_SUGGEST_TIME, LAST_SUGGEST_QUERY
    now = time.monotonic()
    cache_key = f"__{category}__"
    if LAST_SUGGEST_QUERY != cache_key or now - LAST_SUGGEST_TIME < 0.2:
        time.sleep(0.25)
    LAST_SUGGEST_QUERY = cache_key
    LAST_SUGGEST_TIME = time.monotonic()
    items = []
    for cmd in SUGGESTION_CACHE.get(category, []):
        if not prefix or cmd.startswith(prefix):
            items.append(Result(
                Title=cmd,
                SubTitle=describe_command(cmd),
                IcoPath="Images\\app.svg",
                JsonRPCAction=FlowApi.change_query(cmd + " ", True),
            ))
    return items

@plugin.on_method
def query(query: str) -> ResultResponse:
    global fake, current_locale
    lang = to_lang(current_locale)
    if not query or not query.strip():
        # Show top-level category suggestions when only 'faker' is typed
        return send_results(suggestion_results_for_categories(lang))

    parts = query.split()
    category, subtype, option_tokens = resolve_category_provider(parts)
    # Suggest sub-parameters when only category is present
    if category in SUGGESTION_CACHE["categories"] and not subtype:
        typed_prefix = f"faker {category}"
        return send_results(suggestion_results_for_subtypes(lang, category, typed_prefix))
    opts = parse_options(option_tokens)
    if category == "person" and subtype == "name":
        opts["_ordered_tokens"] = option_tokens
    override_locale = normalize(opts.get("lang", "")) if "lang" in opts else None
    repeat = int(opts.get("repeat", "1")) if opts.get("repeat") else 1
    use_newline = bool(opts.get("newline", False))

    if override_locale:
        try:
            gl = override_locale
            fake = Faker(gl)
            current_locale = gl
            lang = to_lang(gl)
        except Exception:
            pass

    if category in SUGGESTION_CACHE["categories"]:
        if not is_command_complete_and_valid(category, subtype, opts, query):
            typed_prefix = f"faker {category} {subtype}".strip()
            return send_results(suggestion_results_for_subtypes(lang, category, typed_prefix))

    def generate_one() -> str:
        try:
            if category == "internet":
                return internet.handle(subtype, fake, opts)
            if category == "finance":
                return finance.handle(subtype, fake, opts)
            if category == "person":
                return person.handle(subtype, fake, opts)
            if category == "date":
                return date.handle(subtype, fake, opts)
            if category == "location":
                return location.handle(subtype, fake, opts)
            if category == "lorem":
                return lorem.handle(subtype, fake, opts)
            if category == "random":
                return random.handle(subtype, fake, opts)
            if category == "vehicle":
                return vehicle.handle(subtype, fake, opts)
            if category == "phone":
                return phone.handle(subtype, fake, opts)
            return str(getattr(fake, category)())
        except Exception as e:
            return f"Error: {e}"

    results = []
    for _ in range(10):
        values = [generate_one() for __ in range(max(1, repeat))]
        data = format_values(values, use_newline)
        action = None
        if len(values) <= 1:
            single = values[0] if values else ""
            action = {"method": "copy_to_clipboard", "parameters": [single]}
        else:
            action = {"method": "copy_to_clipboard", "parameters": [", ".join(values)]}
        preview = None
        if category == "random" and subtype.lower() == "image" and len(values) == 1 and values[0] and not str(values[0]).startswith("Error:"):
            preview = {"PreviewImagePath": values[0], "Description": "Generated Image", "IsMedia": True, "PreviewDeligate": None}
        r = Result(
            Title=data,
            SubTitle=t(lang, "copy_options"),
            IcoPath="Images\\app.svg",
            ContextData=json.dumps({"values": values}),
            JsonRPCAction=action,
            Preview=preview,
        )
        results.append(r)
    return send_results(results)

@plugin.on_method
def context_menu(data: str) -> ResultResponse:
    lang = to_lang(current_locale)
    try:
        payload = json.loads(data)
        values = payload.get("values", [])
    except Exception:
        values = [data]

    items: list[Result] = []
    if len(values) <= 1:
        single = values[0] if values else ""
        items.append(Result(
            Title=t(lang, "copy_single"),
            SubTitle=single,
            IcoPath="Images\\app.svg",
            JsonRPCAction={"method": "copy_to_clipboard", "parameters": [single]},
        ))
    else:
        newline_data = "\n".join(values)
        comma_data = ", ".join(values)
        space_data = " ".join(values)
        json_data = json.dumps(values, ensure_ascii=False)
        items.extend([
            Result(Title=t(lang, "copy_newline"), SubTitle=newline_data, IcoPath="Images\\app.svg",
                   JsonRPCAction={"method": "copy_to_clipboard", "parameters": [newline_data]}),
            Result(Title=t(lang, "copy_comma"), SubTitle=comma_data, IcoPath="Images\\app.svg",
                   JsonRPCAction={"method": "copy_to_clipboard", "parameters": [comma_data]}),
            Result(Title=t(lang, "copy_space"), SubTitle=space_data, IcoPath="Images\\app.svg",
                   JsonRPCAction={"method": "copy_to_clipboard", "parameters": [space_data]}),
            Result(Title=t(lang, "copy_json"), SubTitle="[" + ", ".join(values) + "]", IcoPath="Images\\app.svg",
                   JsonRPCAction={"method": "copy_to_clipboard", "parameters": [json_data]}),
        ])

    return send_results(items)

@plugin.on_method
def copy_to_clipboard(data: str):
    try:
        pyperclip.copy(data)
    except Exception:
        pass

if __name__ == "__main__":
    plugin.run()