"""
can put miscellaneous functions here that can be reused
"""

import datetime

# given two datetime.time objects, return the difference in hours
def time_diff(start_time, end_time):
    date = datetime.datetime(1, 1, 1)
    start = datetime.datetime.combine(date, start_time)
    end = datetime.datetime.combine(date, end_time)
    diff = end - start

    return diff.seconds / 60 / 60
