# import os
# import django

# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "hiring_agency.settings")
# django.setup()

# from agency_api.models import ServiceRequest
# from datetime import timedelta

# def get_service_end_date(serv_req: ServiceRequest):
#     days_service_needed = {
#         0: serv_req.service_needed_monday,
#         1: serv_req.service_needed_tuesday,
#         2: serv_req.service_needed_wednesday,
#         3: serv_req.service_needed_thursday,
#         4: serv_req.service_needed_friday,
#         5: serv_req.service_needed_saturday,
#         6: serv_req.service_needed_sunday
#     }

#     days_of_service = serv_req.days_of_service
#     date = serv_req.start_date

#     # add 1 to start date for each day of service needed
#     while days_of_service > 0:
#         if days_service_needed[date.weekday()]:
#             days_of_service -= 1

#         if days_of_service > 0:
#             date += timedelta(days=1)

#     return date

# serv_req = ServiceRequest.objects.get(id=20)
# print(get_service_end_date(serv_req))

d = [
    {
        "start_time": "09:00:00",
        "end_time": "12:00:00"
    },
    {
        "start_time": "08:00:00",
        "end_time": "12:00:00"
    }
]

print(sorted(d, key=lambda x: x['start_time']))