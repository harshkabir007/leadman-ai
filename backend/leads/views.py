import uuid
import threading
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from .models import Lead
from .serializers import LeadSerializer
from ai.services import classify_lead

class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all().order_by('-submitted_at')
    serializer_class = LeadSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Get request metadata
        ip_address = self.get_client_ip(request)
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        
        tracking_id = str(uuid.uuid4())
        
        lead = serializer.save(
            ip_address=ip_address,
            user_agent=user_agent,
            tracking_id=tracking_id
        )
        
        # Process AI classification and Email asynchronously
        thread = threading.Thread(target=self.process_lead_background, args=(lead.id,))
        thread.start()

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def process_lead_background(self, lead_id):
        try:
            lead = Lead.objects.get(id=lead_id)
            
            # 1. AI Classification
            category, priority = classify_lead(lead.requirement)
            lead.category = category
            lead.priority = priority
            lead.save()

            # 2. Send Tracked Email
            self.send_tracked_email(lead)
        except Exception as e:
            print(f"Background processing error: {e}")

    def send_tracked_email(self, lead):
        subject = "Thank You for Contacting LeadMan AI"
        backend_url = settings.BACKEND_URL
        
        # Tracking pixels and links
        tracking_pixel = f'<img src="{backend_url}/api/open/{lead.tracking_id}/" width="1" height="1">'
        tracking_link = f'{backend_url}/api/click/{lead.tracking_id}/'

        html_content = f"""
        <html>
            <body>
                <p>Hi {lead.name},</p>
                <p>Thank you for contacting LeadMan AI.</p>
                <p>We received your requirement:</p>
                <blockquote style="border-left: 4px solid #ccc; padding-left: 10px; color: #555;">
                    "{lead.requirement}"
                </blockquote>
                <p>Our team will review your request and contact you shortly.</p>
                <p><a href="{tracking_link}" style="display: inline-block; padding: 10px 20px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 5px;">Learn More</a></p>
                <p>Regards,<br>LeadMan AI Team</p>
                {tracking_pixel}
            </body>
        </html>
        """
        
        msg = EmailMultiAlternatives(
            subject=subject,
            body=f"Hi {lead.name},\nThank you for contacting LeadMan AI. We received your requirement: '{lead.requirement}'.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[lead.email]
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send()
        
        lead.email_sent = True
        lead.save()

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0]
        return request.META.get('REMOTE_ADDR')
