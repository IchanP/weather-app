from pydantic import BaseModel
from .AreaName import AreaName
from .Description import Description
from typing import Optional, Union, List

class WarningLevel(BaseModel):
    sv: str
    en: str
    code: str

class EventDescription(BaseModel):
    sv: str
    en: str
    code: str

class AffectedArea(BaseModel):
    id: int
    sv: str
    en: str

class Geometry(BaseModel):
    type: str
    bbox: Optional[list[float]] = None
    # NOTE - The type of coordinates depends on the type field, as defined by the GeoJson specification...
    coordinates: Optional[Union[List[float], Optional[List[List[float]]], Optional[List[List[List[float]]]]]] = None, None, None

class Properties(BaseModel):
    sv: Optional[str] = None
    en: Optional[str] = None

class Area(BaseModel):
    type: str
    geometry: Optional[Geometry] = None
    properties: Optional[Properties] = None

class WarningArea(BaseModel):
    id: int
    approximateStart: str
    approximateEnd: Optional[str] = None
    published: str
    areaName: Optional[AreaName] = None
    warningLevel: WarningLevel
    eventDescription: EventDescription
    affectedAreas: list[AffectedArea]
    descriptions: Optional[list[Description]] = None
    area: Area
