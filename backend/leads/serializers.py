from rest_framework import serializers
from .models import Lead

class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = '__all__'
        read_only_fields = ('category', 'priority', 'tracking_id', 'email_sent', 'opened', 'clicked', 'open_count', 'click_count')
