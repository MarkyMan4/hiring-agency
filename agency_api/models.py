from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

from agency_api.utils.validation import validate_phone

# static data tables
class EducationType(models.Model):
    name = models.CharField(null=False, max_length=30)

class SecurityQuestion(models.Model):
    question = models.CharField(null=False, max_length=100)

class ServiceType(models.Model):
    name = models.CharField(null=False, max_length=30)
    hourly_rate = models.DecimalField(null=False, max_digits=5, decimal_places=2)
    earliest_work_time = models.TimeField(null=False)
    latest_work_time = models.TimeField(null=False)
    
# other tables
class SecurityQuestionAnswer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(SecurityQuestion, on_delete=models.CASCADE)
    answer = models.CharField(null=False, max_length=500)

class CareTaker(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    address = models.CharField(null=False, max_length=500)
    phone_number = models.BigIntegerField(null=False, validators=[validate_phone])
    email = models.EmailField(null=False, max_length=100)

class CareTakerRequest(models.Model):
    first_name = models.CharField(null=False, max_length=50)
    last_name = models.CharField(null=False, max_length=50)
    address = models.CharField(null=False, max_length=500)
    phone_number = models.BigIntegerField(null=False, validators=[validate_phone])
    email = models.EmailField(null=False, max_length=100)
    date_requested = models.DateTimeField(null=False)
    is_pending = models.BooleanField(null=False, default=False)
    is_approved = models.BooleanField(null=False, default=False)

class StaffMember(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    address = models.CharField(null=False, max_length=500)
    phone_number = models.BigIntegerField(null=False)
    email = models.EmailField(null=False, max_length=200)

class HealthCareProfessional(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    gender = models.CharField(null=False, max_length=10)
    date_of_birth = models.DateField(null=False)
    ssn = models.IntegerField(null=False)
    service_type = models.ForeignKey(ServiceType, on_delete=models.CASCADE)
    education_type = models.ForeignKey(EducationType, on_delete=models.CASCADE)
    education_institution = models.CharField(null=False, max_length=200)
    graduation_year = models.IntegerField(null=False)
    graduation_month = models.IntegerField(null=False)
    years_of_experience = models.IntegerField(null=False)
    address = models.CharField(null=False, max_length=500)
    phone_number = models.BigIntegerField(null=False)
    email = models.CharField(null=False, max_length=200)
    hourly_rate = models.DecimalField(null=False, max_digits=5, decimal_places=2)
    
class Payment(models.Model):
    healthcare_professional = models.ForeignKey(HealthCareProfessional, on_delete=models.CASCADE)
    date_of_payment = models.DateTimeField(null=False)
    amount = models.DecimalField(null=False, max_digits=10, decimal_places=2)

    class Meta:
        ordering = ['-date_of_payment']

class PendingPayment(models.Model):
    user_id = models.IntegerField(null=False)
    healthcare_professional_id = models.IntegerField(null=False)
    full_name = models.CharField(null=False, max_length=200)
    username = models.CharField(null=False, max_length=200)
    hourly_rate = models.DecimalField(null=False, max_digits=5, decimal_places=2)
    hours_worked = models.DecimalField(null=False, max_digits=5, decimal_places=2)
    amt_paid = models.DecimalField(null=False, max_digits=12, decimal_places=2)
    amt_owed = models.DecimalField(null=False, max_digits=12, decimal_places=2)

    class Meta:
        managed = False
        db_table = 'agency_api_pendingpayment'
    
class ServiceRequest(models.Model):
    care_taker = models.ForeignKey(CareTaker, on_delete=models.CASCADE)
    patient_first_name = models.CharField(null=False, max_length=50)
    patient_last_name = models.CharField(null=False, max_length=50)
    patient_gender = models.CharField(null=False, max_length=10)
    patient_date_of_birth = models.DateField(null=False)
    patient_phone_number = models.BigIntegerField(null=True, validators=[validate_phone])
    patient_email = models.EmailField(null=True, max_length=200)
    service_location = models.CharField(null=False, max_length=500)
    start_date = models.DateField(null=False)
    flexible_hours = models.BooleanField(null=False)
    service_start_time = models.TimeField(null=True) # start and end time only specified if not using flexible hours
    service_end_time = models.TimeField(null=True)
    hours_of_service_daily = models.IntegerField(null=True) # only populated if flexible hours are selected
    service_type = models.ForeignKey(ServiceType, on_delete=models.CASCADE)
    service_needed_sunday = models.BooleanField(null=False)
    service_needed_monday = models.BooleanField(null=False)
    service_needed_tuesday = models.BooleanField(null=False)
    service_needed_wednesday = models.BooleanField(null=False)
    service_needed_thursday = models.BooleanField(null=False)
    service_needed_friday = models.BooleanField(null=False)
    service_needed_saturday = models.BooleanField(null=False)
    days_of_service = models.IntegerField(null=False)
    hp_gender_required = models.BooleanField(null=False) # whether the gender of the healthcare professional must be the same as the patient
    hp_min_age = models.IntegerField(null=True)
    hp_max_age = models.IntegerField(null=True)
    is_assigned = models.BooleanField(null=False, default=False) # whether a healthcare professional has been assigned to this request
    is_completed = models.BooleanField(null=False, default=False) # becomes true once a healthcare professional is assigned, becomes false once the work is complete

class JobPosting(models.Model):
    service_type = models.ForeignKey(ServiceType, on_delete=models.CASCADE)
    education_type = models.ForeignKey(EducationType, on_delete=models.CASCADE)
    years_experience_required = models.IntegerField(null=False)
    description = models.CharField(null=True, max_length= 500)

class HPJobApplication(models.Model):
    first_name = models.CharField(null=False, max_length=50)
    last_name = models.CharField(null = False,max_length=50)
    gender = models.CharField(null=False, max_length=10)
    date_of_birth = models.DateField(null=False)
    ssn = models.IntegerField(null=False)
    service_type = models.ForeignKey(ServiceType, on_delete=models.CASCADE)
    education_type = models.ForeignKey(EducationType, on_delete=models.CASCADE)
    education_institution = models.CharField(null=False, max_length=200)
    graduation_year = models.IntegerField(null=False)
    graduation_month = models.IntegerField(null=False)
    years_of_experience = models.IntegerField(null=False)
    address = models.CharField(null=False, max_length=500)
    phone_number = models.BigIntegerField(null=False)
    email = models.EmailField(null=False, max_length=200)
    job = models.ForeignKey(JobPosting, on_delete=models.CASCADE)
    is_pending = models.BooleanField(null=False, default=True)
    is_approved = models.BooleanField(null=False, default=False)

class ServiceAssignment(models.Model):
    healthcare_professional = models.ForeignKey(HealthCareProfessional, on_delete=models.CASCADE)
    service_request = models.ForeignKey(ServiceRequest, on_delete=models.CASCADE)

class TimeSlot(models.Model):
    service_assignment = models.ForeignKey(ServiceAssignment, on_delete=models.CASCADE)
    day = models.IntegerField(null=False)
    start_time = models.TimeField(null=False)
    end_time = models.TimeField(null=False)

class BillingAccount(models.Model):
    service_request = models.ForeignKey(ServiceRequest, on_delete=models.CASCADE)
    amt_paid = models.DecimalField(null=False, max_digits=20, decimal_places=2)

class ServiceEntry(models.Model):
    billing_account = models.ForeignKey(BillingAccount, on_delete=models.CASCADE)
    healthcare_professional = models.ForeignKey(HealthCareProfessional, on_delete=models.CASCADE)
    date_of_service = models.DateField(null=False)
    start_time = models.TimeField(null=False)
    end_time = models.TimeField(null=False)

    class Meta:
        ordering = ['-date_of_service', '-start_time']

class AccountStatus(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_locked = models.BooleanField(null=False)

# when a user is created, automatically create an AccountStatus record
# to tell whether the account is locked
@receiver(post_save, sender=User)
def create_account_status(sender, instance, created, **kwargs):
    if created:
        AccountStatus.objects.create(user=instance, is_locked=False)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.accountstatus.save()
