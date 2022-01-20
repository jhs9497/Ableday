import django
from django.utils import version

print(django.VERSION)
print(django.get_version())
print(version.get_complete_version())
print(version.get_version())