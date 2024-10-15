from django.core.management.base import BaseCommand
from django.apps import apps
import ast
import os


class Command(BaseCommand):
    help = "Populate SidebarSection and SidebarItem models with data from sidebar.txt"

    def handle(self, *args, **options):
        SidebarSection = apps.get_model("operations", "SidebarSection")
        SidebarItem = apps.get_model("operations", "SidebarItem")

        # Read the sidebar.txt file
        sidebar_path = os.path.join(os.path.dirname(__file__), 'sidebar.txt')
        with open(sidebar_path, "r") as file:
            content = file.read()

        # Extract the menuItems list using ast
        menu_items = ast.literal_eval(content.split("=", 1)[1].strip())

        # Iterate through sections and items
        for section_data in menu_items:
            if section_data is None:
                continue

            section, created = SidebarSection.objects.get_or_create(
                section=section_data["section"]
            )
            self.stdout.write(
                f"{'Created' if created else 'Updated'} section: {section.section}"
            )

            for item_data in section_data["items"]:
                item, created = SidebarItem.objects.update_or_create(
                    section=section,
                    path=item_data["path"],
                    defaults={
                        "icon": item_data["icon"].__name__,  # Store the icon class name as a string
                        "label": item_data["label"],
                    },
                )
                self.stdout.write(
                    f"{'Created' if created else 'Updated'} item: {item.label}"
                )

        self.stdout.write(self.style.SUCCESS("Successfully populated sidebar data"))
