def anytime(fake, options: dict) -> str:
    return str(fake.date())

from datetime import datetime

def _coerce_date(value):
    if isinstance(value, (datetime, )):
        return value
    if isinstance(value, str):
        s = value.strip()
        # Accept ISO date strings like YYYY-MM-DD and convert to date object
        try:
            if len(s) == 10 and s[4] == '-' and s[7] == '-':
                return datetime.strptime(s, "%Y-%m-%d").date()
        except Exception:
            pass
        # Fallback to relative tokens supported by Faker (e.g., '-30y', 'today')
        return s
    return value

def between(fake, options: dict) -> str:
    start_raw = options.get("from") or options.get("start") or "-30y"
    end_raw = options.get("to") or options.get("end") or "today"
    start = _coerce_date(start_raw)
    end = _coerce_date(end_raw)
    return str(fake.date_between(start_date=start, end_date=end))

def handle(subtype: str, fake, options: dict) -> str:
    m = (subtype or "").lower()
    if m == "anytime":
        return anytime(fake, options)
    if m == "between":
        return between(fake, options)
    if m in {"birthdate", "birtdate"}:
        return birthdate(fake, options)
    raise ValueError(f"Unknown date subtype: {subtype}")

def birthdate(fake, options: dict) -> str:
    mode = options.get("mode", "age")
    if mode == "year":
        min_y = int(options.get("min", 1900))
        max_y = int(options.get("max", 2000))
        year = fake.random_int(min=min_y, max=max_y)
        month = fake.random_int(min=1, max=12)
        day = fake.random_int(min=1, max=28)
        return f"{year:04d}-{month:02d}-{day:02d}"
    else:
        min_age = int(options.get("min", 18))
        max_age = int(options.get("max", 80))
        return str(fake.date_of_birth(minimum_age=min_age, maximum_age=max_age))