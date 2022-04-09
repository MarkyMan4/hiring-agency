from agency_api.utils.utils import time_diff
from agency_api.models import ServiceRequest
from agency_api.models import ServiceEntry
from datetime import timedelta

# given a service request, calculate the end date
def get_service_end_date(serv_req: ServiceRequest):
    days_service_needed = {
        0: serv_req.service_needed_monday,
        1: serv_req.service_needed_tuesday,
        2: serv_req.service_needed_wednesday,
        3: serv_req.service_needed_thursday,
        4: serv_req.service_needed_friday,
        5: serv_req.service_needed_saturday,
        6: serv_req.service_needed_sunday
    }

    days_of_service = serv_req.days_of_service
    date = serv_req.start_date

    # add 1 to start date for each day of service needed
    while days_of_service > 0:
        if days_service_needed[date.weekday()]:
            days_of_service -= 1

        if days_of_service > 0:
            date += timedelta(days=1)

    return date

def get_hours_of_service_remaining(serv_req: ServiceRequest):
    service_entries = ServiceEntry.objects.filter(billing_account__service_request=serv_req.id)
    hours_worked = 0

    for se in service_entries:
        hours_worked += time_diff(se.start_time, se.end_time)

    hours_worked = round(hours_worked, 2)

    if serv_req.flexible_hours:
        hours_per_day_requested = serv_req.hours_of_service_daily
    else:
        hours_per_day_requested = time_diff(serv_req.service_start_time, serv_req.service_end_time)

    total_hours_requested = hours_per_day_requested * serv_req.days_of_service
    hours_remaining = round(total_hours_requested - hours_worked, 2)

    return total_hours_requested, hours_worked, hours_remaining
