from typing import Optional, get_type_hints, Type

from pydantic import BaseModel


def make_optional(
    exclude: Optional[list[str]] = None
):
    """Return a decorator to make model fields optional"""

    if exclude is None:
        exclude = []

    # Create the decorator
    def decorator(cls: Type[BaseModel]):
        type_hints = get_type_hints(cls)
        fields = cls.__fields__

        for item in exclude:
            cls.__fields__.pop(item)
        fields = fields.items()

        for name, field in fields:
            if name in exclude:
                continue
            if not field.required:
                continue
            # Update pydantic ModelField to not required
            field.required = False
            # Update/append annotation
            cls.__annotations__[name] = Optional[type_hints[name]]
        return cls

    return decorator