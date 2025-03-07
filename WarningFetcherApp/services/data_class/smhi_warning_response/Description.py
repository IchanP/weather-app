from pydantic import BaseModel

class Title(BaseModel):
    sv: str
    en: str
    code: str

class Text(BaseModel):
    sv: str
    en: str

class Description(BaseModel):
    title: Title
    text: Text