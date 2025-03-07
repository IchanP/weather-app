from pydantic import BaseModel
from .AreaName import AreaName
from .Description import Description
from typing import Optional

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
    coordinates: list[list[list[float]]]

class Properties(BaseModel):
    sv: Optional[str] = None
    en: Optional[str] = None

class Area(BaseModel):
    type: str
    geometry: Geometry
    properties: Optional[Properties] = None
    # TODO - read this : https://datatracker.ietf.org/doc/html/rfc7946

class WarningArea(BaseModel):
    id: int
    approximateStart: str
    approximateEnd: str
    published: str
    areaName: AreaName
    warningLevel: WarningLevel
    eventDescription: EventDescription
    affectedAreas: list[AffectedArea]
    descriptions: list[Description]
    area: Area
