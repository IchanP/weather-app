from pydantic import BaseModel

class AreaName(BaseModel):
    sv: str
    en: str