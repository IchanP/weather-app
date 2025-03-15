from pydantic import BaseModel
from .Event import Event    
from .AreaName import AreaName
from .Description import Description
from .WarningArea import WarningArea
from typing import Optional

class SmhiWarningResponse(BaseModel):
    id: int
    event: Event
    areaName: Optional[AreaName] = None
    descriptions: Optional[list[Description]] = None
    warningAreas: list[WarningArea]
    
    class Config:
        extra = 'ignore'

