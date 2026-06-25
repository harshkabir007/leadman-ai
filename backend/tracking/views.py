from django.http import HttpResponse, HttpResponseRedirect
from django.conf import settings
from leads.models import Lead

def track_open(request, tracking_id):
    """
    Tracks when an email is opened via a 1x1 invisible pixel.
    """
    try:
        lead = Lead.objects.get(tracking_id=tracking_id)
        if not lead.opened:
            lead.opened = True
        lead.open_count += 1
        lead.save()
    except Lead.DoesNotExist:
        pass

    # Return a 1x1 transparent GIF
    pixel = b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00\x21\xf9\x04\x01\x00\x00\x00\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b'
    return HttpResponse(pixel, content_type='image/gif')


def track_click(request, tracking_id):
    """
    Tracks when a link in the email is clicked and redirects.
    """
    try:
        lead = Lead.objects.get(tracking_id=tracking_id)
        if not lead.clicked:
            lead.clicked = True
        lead.click_count += 1
        lead.save()
    except Lead.DoesNotExist:
        pass

    frontend_url = settings.CORS_ALLOWED_ORIGINS[0] if getattr(settings, 'CORS_ALLOWED_ORIGINS', None) else 'http://localhost:3000'
    return HttpResponseRedirect(f"{frontend_url}/#contact")
