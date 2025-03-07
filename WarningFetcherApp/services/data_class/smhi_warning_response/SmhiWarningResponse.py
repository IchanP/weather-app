from pydantic import BaseModel
from .Event import Event    
from .AreaName import AreaName
from .Description import Description
from .WarningArea import WarningArea
class SmhiWarningResponse(BaseModel):
    id: int
    event: Event
    areaName: AreaName
    descriptions: list[Description]
    warningAreas: list[WarningArea]
    
    class Config:
        extra = 'ignore'

