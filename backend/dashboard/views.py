from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import timedelta
from django.db.models import Count, Q
from leads.models import Lead

class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        now = timezone.now()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        week_start = today_start - timedelta(days=7)
        month_start = today_start - timedelta(days=30)
        
        leads = Lead.objects.all()
        total_leads = leads.count()
        emails_sent = leads.filter(email_sent=True).count()
        emails_opened = leads.filter(opened=True).count()
        emails_not_opened = emails_sent - emails_opened
        link_clicks = leads.filter(clicked=True).count()
        
        open_rate = (emails_opened / emails_sent * 100) if emails_sent > 0 else 0
        click_rate = (link_clicks / emails_opened * 100) if emails_opened > 0 else 0
        
        todays_leads = leads.filter(submitted_at__gte=today_start).count()
        weekly_leads = leads.filter(submitted_at__gte=week_start).count()
        monthly_leads = leads.filter(submitted_at__gte=month_start).count()
        
        # Chart Data: Last 30 Days
        daily_chart_labels = []
        daily_chart_data = []
        for i in range(29, -1, -1):
            day = today_start - timedelta(days=i)
            next_day = day + timedelta(days=1)
            count = leads.filter(submitted_at__gte=day, submitted_at__lt=next_day).count()
            daily_chart_labels.append(day.strftime('%b %d'))
            daily_chart_data.append(count)
            
        # Chart Data: Categories
        category_counts = leads.values('category').annotate(count=Count('category')).order_by('-count')
        category_labels = [item['category'] or 'Other' for item in category_counts if item['count'] > 0]
        category_data = [item['count'] for item in category_counts if item['count'] > 0]

        return Response({
            'total_leads': total_leads,
            'emails_sent': emails_sent,
            'emails_opened': emails_opened,
            'emails_not_opened': emails_not_opened,
            'link_clicks': link_clicks,
            'open_rate': open_rate,
            'click_rate': click_rate,
            'todays_leads': todays_leads,
            'weekly_leads': weekly_leads,
            'monthly_leads': monthly_leads,
            'daily_chart_labels': daily_chart_labels,
            'daily_chart_data': daily_chart_data,
            'category_labels': category_labels,
            'category_data': category_data,
        })
