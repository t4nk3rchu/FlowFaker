def accountName(fake, options: dict) -> str:
    return f"{fake.company()} Account"

def accountNumber(fake, options: dict) -> str:
    length = int(options.get("length", 8))
    return fake.numerify("#" * length)

def creditCardCVV(fake, options: dict) -> str:
    return fake.credit_card_security_code()

def creditCardNumber(fake, options: dict) -> str:
    issuer = options.get("issuer")
    if issuer:
        return fake.credit_card_number(card_type=issuer)
    return fake.credit_card_number()

def handle(subtype: str, fake, options: dict) -> str:
    m = subtype.lower()
    if m == "accountname":
        return accountName(fake, options)
    if m == "accountnumber":
        return accountNumber(fake, options)
    if m == "creditcardcvv":
        return creditCardCVV(fake, options)
    if m == "creditcardnumber":
        return creditCardNumber(fake, options)
    return fake.currency_code()

def handle(subtype: str, fake, options: dict) -> str:
    m = subtype
    if m == "accountName":
        return accountName(fake, options)
    if m == "accountNumber":
        return accountNumber(fake, options)
    if m == "creditCardCVV":
        return creditCardCVV(fake, options)
    if m == "creditCardNumber":
        return creditCardNumber(fake, options)
    return fake.currency_code()