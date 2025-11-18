def fullName(fake, options: dict) -> str:
    sex = options.get("sex")
    if sex == "male":
        return fake.name_male()
    if sex == "female":
        return fake.name_female()
    return fake.name()

def firstName(fake, options: dict) -> str:
    sex = options.get("sex")
    if sex == "male" and hasattr(fake, "first_name_male"):
        return fake.first_name_male()
    if sex == "female" and hasattr(fake, "first_name_female"):
        return fake.first_name_female()
    male_available = hasattr(fake, "first_name_male")
    female_available = hasattr(fake, "first_name_female")
    if male_available and female_available:
        return fake.first_name_male() if fake.random_int(min=0, max=1) == 0 else fake.first_name_female()
    if male_available:
        return fake.first_name_male()
    if female_available:
        return fake.first_name_female()
    return fake.first_name()

def lastName(fake, options: dict) -> str:
    sex = options.get("sex")
    if sex == "male" and hasattr(fake, "last_name_male"):
        return fake.last_name_male()
    if sex == "female" and hasattr(fake, "last_name_female"):
        return fake.last_name_female()
    return fake.last_name()
    
def middleName(fake, options: dict) -> str:
    sex = options.get("sex")
    if sex == "male" and hasattr(fake, "middle_name_male"):
        return fake.middle_name_male()
    if sex == "female" and hasattr(fake, "middle_name_female"):
        return fake.middle_name_female()
    if hasattr(fake, "middle_name"):
        return fake.middle_name()
    male_available = hasattr(fake, "first_name_male")
    female_available = hasattr(fake, "first_name_female")
    if male_available and female_available:
        return fake.first_name_male() if fake.random_int(min=0, max=1) == 0 else fake.first_name_female()
    if male_available:
        return fake.first_name_male()
    if female_available:
        return fake.first_name_female()
    return fake.first_name()

def jobTitle(fake, options: dict) -> str:
    return fake.job()

def bio(fake, options: dict) -> str:
    return fake.text(max_nb_chars=160)

def orderedName(fake, options: dict) -> str:
    raw_tokens = options.get("_ordered_tokens", [])
    positional = [t.lower() for t in raw_tokens if t and ":" not in t][:3]
    if len(positional) < 2 or not all(t in {"first", "last", "middle"} for t in positional):
        return "Error: orderedName requires two tokens: first last"
    lang = options.get("lang")
    local_fake = fake
    if lang and "{" not in lang and "}" not in lang:
        try:
            from faker import Faker as _F
            local_fake = _F(lang)
        except Exception:
            local_fake = fake
    ln = local_fake.last_name() if hasattr(local_fake, "last_name") else local_fake.name().split()[-1]
    male_available = hasattr(local_fake, "first_name_male")
    female_available = hasattr(local_fake, "first_name_female")
    if male_available and female_available:
        fn = local_fake.first_name_male() if local_fake.random_int(min=0, max=1) == 0 else local_fake.first_name_female()
    elif male_available:
        fn = local_fake.first_name_male()
    elif female_available:
        fn = local_fake.first_name_female()
    else:
        fn = local_fake.first_name() if hasattr(local_fake, "first_name") else local_fake.name().split()[0]
    mid = middleName(local_fake, {})
    ln = str(ln).strip()
    fn = str(fn).strip()
    mid = str(mid).strip()
    values = {
        "first": fn,
        "last": ln,
        "middle": mid,
    }
    ordered = [values[t] for t in positional]
    return " ".join(ordered)

def handle(subtype: str, fake, options: dict) -> str:
    m = subtype
    if m == "fullName":
        return fullName(fake, options)
    if m == "firstName":
        return firstName(fake, options)
    if m == "lastName":
        return lastName(fake, options)
    if m == "middleName":
        return middleName(fake, options)
    if m == "jobTitle":
        return jobTitle(fake, options)
    if m == "bio":
        return bio(fake, options)
    if m == "orderedName":
        return orderedName(fake, options)
    return fake.name()

def handle(subtype: str, fake, options: dict) -> str:
    m = subtype
    if m == "fullName":
        return fullName(fake, options)
    if m == "firstName":
        return firstName(fake, options)
    if m == "lastName":
        return lastName(fake, options)
    if m == "middleName":
        return middleName(fake, options)
    if m == "jobTitle":
        return jobTitle(fake, options)
    if m == "bio":
        return bio(fake, options)
    if m == "orderedName":
        return orderedName(fake, options)
    return fake.name()

def handle(subtype: str, fake, options: dict) -> str:
    m = subtype
    if m == "fullName":
        return fullName(fake, options)
    if m == "firstName":
        return firstName(fake, options)
    if m == "lastName":
        return lastName(fake, options)
    if m == "middleName":
        return middleName(fake, options)
    if m == "jobTitle":
        return jobTitle(fake, options)
    if m == "bio":
        return bio(fake, options)
    if m == "orderedName":
        return orderedName(fake, options)
    return fake.name()