from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from django.core.mail import send_mail
from django.conf import settings
import datetime


def create_google_calendar_event(client_request):
    # This is a placeholder for Google Calendar API credentials
    # You'll need to set up OAuth 2.0 and get the necessary credentials
    creds = Credentials.from_authorized_user_file(
        "token.json", ["https://www.googleapis.com/auth/calendar"]
    )

    service = build("calendar", "v3", credentials=creds)

    event = {
        "summary": f"Demo for {client_request.company_name}",
        "description": f"Demo request for {client_request.service_requested}",
        "start": {
            "dateTime": client_request.scheduled_date.isoformat(),
            "timeZone": "UTC",
        },
        "end": {
            "dateTime": (
                client_request.scheduled_date + datetime.timedelta(hours=1)
            ).isoformat(),
            "timeZone": "UTC",
        },
        "attendees": [
            {"email": client_request.client_email},
            {"email": client_request.assigned_staff.email},
        ],
    }

    event = service.events().insert(calendarId="primary", body=event).execute()
    return event


def send_calendar_invite_email(client_request, event):
    subject = f"Demo Scheduled: {client_request.company_name}"
    message = f"""
    Hello {client_request.client_name},

    Your demo for {client_request.service_requested} has been scheduled for {client_request.scheduled_date}.

    Please find the Google Calendar invite link below:
    {event['htmlLink']}

    If you have any questions, please don't hesitate to contact us.

    Best regards,
    Your Demo Team
    """
    from_email = settings.DEFAULT_FROM_EMAIL
    recipient_list = [client_request.client_email, client_request.assigned_staff.email]

    send_mail(subject, message, from_email, recipient_list)
