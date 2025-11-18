from typing import Optional

def display_name(fake, options: dict) -> str:
    first = options.get("first")
    last = options.get("last")
    if first and last:
        return f"{first}.{last}{fake.random_int(0,99)}"
    if first:
        return f"{first}{fake.random_int(0,99)}"
    return fake.user_name()

def domain_name(fake, options: dict) -> str:
    return fake.domain_name()

def email(fake, options: dict) -> str:
    first = options.get("first")
    last = options.get("last")
    if first and last:
        return fake.email(first_name=first, last_name=last)
    if first:
        return fake.email(first_name=first)
    return fake.email()

def ipv4(fake, options: dict) -> str:
    return fake.ipv4()

def ipv6(fake, options: dict) -> str:
    return fake.ipv6()

def username(fake, options: dict) -> str:
    first = options.get("first")
    last = options.get("last")
    if first and last:
        return fake.user_name() if not (first or last) else f"{first}_{last}{fake.random_int(0,99)}"
    if first:
        return f"{first}{fake.random_int(0,99)}"
    return fake.user_name()

def password(fake, options: dict) -> str:
    length = int(options.get("length", 12))
    return fake.password(length=length)

def handle(subtype: str, fake, options: dict) -> str:
    m = subtype.lower()
    if m == "displayname":
        return display_name(fake, options)
    if m == "domainname":
        return domain_name(fake, options)
    if m == "email":
        return email(fake, options)
    if m == "ipv4":
        return ipv4(fake, options)
    if m == "ipv6":
        return ipv6(fake, options)
    if m == "username":
        return username(fake, options)
    if m == "password":
        return password(fake, options)
    return fake.url()