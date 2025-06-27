from pydantic import BaseModel
from typing import List

class UserPreferences(BaseModel):
    device_id: str
    activity_type: str
    selections: List[str]