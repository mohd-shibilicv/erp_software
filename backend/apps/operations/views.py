from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from templated_email import send_templated_mail
import json
import logging
import traceback


class GroupMailingView(APIView):
    def post(self, request):
        group = request.data.get('group')
        subject = request.data.get('subject')
        message = request.data.get('message')
        recipients = json.loads(request.data.get('recipients', '[]'))

        if not all([group, subject, message, recipients]):
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            for recipient in recipients:
                if recipient['selected']:
                    send_templated_mail(
                        template_name='group_mail',
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[recipient['email']],
                        context={
                            'subject': subject,
                            'message': message,
                            'recipient_name': recipient['name']
                        },
                    )

            return Response({"message": "Emails sent successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            logging.error(f"Error in GroupMailingView: {str(e)}")
            logging.error(traceback.format_exc())
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
