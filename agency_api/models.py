from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# static data tables
class EducationType(models.Model):
    name = models.CharField(null=False, max_length=30)

class SecurityQuestion(models.Model):
    question = models.CharField(null=False, max_length=100)

class ServiceType(models.Model):
    name = models.CharField(null=False, max_length=30)

# other tables
class SecurityQuestionAnswer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(SecurityQuestion, on_delete=models.CASCADE)
    answer = models.CharField(null=False, max_length=500)

class CareTaker(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    address = models.CharField(null=False, max_length=500)
    phone_number = models.IntegerField(null=False)
    email = models.CharField(null=False, max_length=100)

class CareTakerRequest(models.Model):
    first_name = models.CharField(null=False, max_length=50)
    last_name = models.CharField(null=False, max_length=50)
    address = models.CharField(null=False, max_length=500)
    phone_number = models.IntegerField(null=False)
    email = models.CharField(null=False, max_length=100)
    date_requested = models.DateTimeField(null=False)
    is_pending = models.BooleanField(null=False, default=False)
    is_approved = models.BooleanField(null=False, default=False)

class StaffMember(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    address = models.CharField(null=False, max_length=500)
    phone_number = models.IntegerField(null=False)
    email = models.EmailField(null=False, max_length=200)

class HealthCareProfessional(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    gender = models.CharField(null=False, max_length=1)
    date_of_birth = models.DateField(null=False)
    ssn = models.IntegerField(null=False)
    service_type = models.ForeignKey(ServiceType, on_delete=models.CASCADE)
    education_type = models.ForeignKey(EducationType, on_delete=models.CASCADE)
    education_institution = models.CharField(null=False, max_length=200)
    graduation_year = models.IntegerField(null=False)
    graduation_month = models.IntegerField(null=False)
    years_of_experience = models.IntegerField(null=False)
    address = models.CharField(null=False, max_length=500)
    phone_number = models.IntegerField(null=False)
    email = models.CharField(null=False, max_length=200)
    
class ServiceRequest(models.Model):
    care_taker = models.ForeignKey(CareTaker, on_delete=models.CASCADE)
    patient_first_name = models.CharField(null=False, max_length=50)
    patient_last_name = models.CharField(null=False, max_length=50)
    patient_gender = models.CharField(null=False, max_length=1)
    patient_date_of_birth = models.DateField(null=False)
    patient_phone_number = models.IntegerField(null=True)
    patient_email = models.CharField(null=True, max_length=200)
    service_location = models.CharField(null=False, max_length=500)
    flexible_hours = models.BooleanField(null=False)
    service_start_time = models.TimeField() # start and end time only specified if not using flexible hours
    service_end_time = models.TimeField()
    hours_of_service_daily = models.IntegerField() # only populated if flexible hours are selected
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
    hp_min_age = models.IntegerField()
    hp_max_age = models.IntegerField()

class JobPosting(models.Model):
    service_type = models.ForeignKey(ServiceType, on_delete=models.CASCADE)
    education_type = models.ForeignKey(EducationType, on_delete=models.CASCADE)
    years_experience_required = models.IntegerField(null=False)
    description = models.CharField(null=True, max_length= 500)

class HPJobApplication(models.Model):
    gender = models.CharField(null=False, max_length=1)
    date_of_birth = models.DateField(null=False)
    ssn = models.IntegerField(null=False)
    service_type = models.ForeignKey(ServiceType, on_delete=models.CASCADE)
    education_type = models.ForeignKey(EducationType, on_delete=models.CASCADE)
    education_institution = models.CharField(null=False, max_length=200)
    graduation_year = models.IntegerField(null=False)
    graduation_month = models.IntegerField(null=False)
    years_of_experience = models.IntegerField(null=False)
    address = models.CharField(null=False, max_length=500)
    phone_number = models.IntegerField(null=False)
    email = models.CharField(null=False, max_length=200)
    job = models.ForeignKey(JobPosting, on_delete=models.CASCADE)


class ServiceAssignment(models.Model):
    healthcare_professional = models.ForeignKey(HealthCareProfessional, on_delete=models.CASCADE)
    service_request = models.ForeignKey(ServiceRequest, on_delete=models.CASCADE)

class BillingAccount(models.Model):
    service_request = models.ForeignKey(ServiceRequest, on_delete=models.CASCADE)
    hourly_rate = models.DecimalField(null=False, max_digits=5, decimal_places=2)
    amt_paid = models.DecimalField(null=False, max_digits=20, decimal_places=2)
    amt_to_be_paid = models.DecimalField(null=False, max_digits=20, decimal_places=2)

class ServiceEntry(models.Model):
    billing_account = models.ForeignKey(BillingAccount, on_delete=models.CASCADE)
    start_time = models.TimeField(null=False)
    end_time = models.TimeField(null=False)

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
