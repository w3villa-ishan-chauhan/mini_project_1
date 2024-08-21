import os
from dotenv import load_dotenv
from twilio.rest import Client

load_dotenv()


# Find your Account SID and Auth Token at twilio.com/console
# and set the environment variables. See http://twil.io/secure
account_sid = os.getenv("account_sid")
auth_token = os.getenv("auth_token")
twilio_service_id = os.getenv("twilio_service_id")
twilio_email_service_id = os.getenv("twilio_email_service_id")

client = Client(account_sid, auth_token)

new_factor = (
    client.verify.v2.services(twilio_service_id)
    .entities("ff483d1ff591898a9942916050d2ca3f")
    .new_factors.create(friendly_name="Taylor's Account Name", factor_type="totp")
)
# verification = client.verify.v2.services(twilio_email_service_id).verifications.create(
#     channel="email", to="harsh.vashisth@w3villa.com"
# )

# print(verification.sid)


def send_verification_code(to):

    if not to.startswith("+"):
        to = f"+91{to}"
    verification = client.verify.services(twilio_service_id).verifications.create(
        to=to, channel="sms"
    )
    return verification.sid


print("new_factor: ", new_factor.binding)


def verify_code(to, code):
    if not to.startswith("+"):
        to = f"+91{to}"
    verification_check = client.verify.services(
        twilio_service_id
    ).verification_checks.create(to=to, code=code)
    return verification_check.status == "approved"


def send_email(to):

    verification = client.verify.services(twilio_email_service_id).verifications.create(
        to=to, channel="email"
    )
    return verification.sid


def verify_email_code(to, code):
    verification_check = client.verify.services(
        twilio_email_service_id
    ).verification_checks.create(to=to, code=code)
    return verification_check.status == "approved"
