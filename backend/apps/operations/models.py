from django.db import models


class SidebarSection(models.Model):
    section = models.CharField(max_length=100)
    is_visible = models.BooleanField(default=True)

    def __str__(self):
        return self.section


class SidebarItem(models.Model):
    section = models.ForeignKey(
        SidebarSection, related_name="items", on_delete=models.CASCADE
    )
    path = models.CharField(max_length=100)
    icon = models.CharField(max_length=50)
    label = models.CharField(max_length=100)
    is_visible = models.BooleanField(default=True)

    def __str__(self):
        return self.label
