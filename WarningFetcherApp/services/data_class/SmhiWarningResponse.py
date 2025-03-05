from dataclasses import dataclass
from pydantic import BaseModel

class SmhiWarningResponse(BaseModel):
    id: int
    
    class Config:
        extra = 'ignore'