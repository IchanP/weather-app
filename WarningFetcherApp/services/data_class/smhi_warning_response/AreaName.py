from pydantic import BaseModel
from typing import Optional
class AreaName(BaseModel):
    sv: Optional[str] = None
    en: Optional[str] = None