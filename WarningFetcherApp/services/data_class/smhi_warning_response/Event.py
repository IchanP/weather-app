from pydantic import BaseModel

class MhoClassification(BaseModel):
    sv: str
    en: str
    code: str

class Event(BaseModel):
    en: str
    sv: str
    code: str
    mhoClassification: MhoClassification