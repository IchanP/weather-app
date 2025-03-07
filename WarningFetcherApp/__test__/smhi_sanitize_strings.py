# New data to be integrated

def build_event_data(BASE_EVENT_ID: int, BASE_EVENT_AREA_NAME: str, BASE_EVENT_CODE: str, BASE_EVENT_MHO_CODE: str) -> str:
    return f"""
[
    {{
        "id": {BASE_EVENT_ID},
        "areaName": {{ "sv": "{BASE_EVENT_AREA_NAME}", "en": "TEST Lake Vänern" }},
        "normalProbability": true,
        "event": {{
            "sv": "Översvämning",
            "en": "Flooding",
            "code": "{BASE_EVENT_CODE}",
            "mhoClassification": {{
                "sv": "Hydrologi",
                "en": "Hydrology",
                "code": "{BASE_EVENT_MHO_CODE}"
            }}
        }},
        "descriptions": [
            {{
                "title": {{
                    "sv": "Händelsebeskrivning",
                    "en": "Description of incident",
                    "code": "INCIDENT"
                }},
                "text": {{
                    "sv": "TESTMEDDELANDE Översvämningar förväntas kommande dagarna mellan Näs bruk och Gysinge i samband med snösmältning.",
                    "en": "TEST PLEASE DISREGARD Flooding caused by snowmelt is expected the coming days between Näs bruk and Gysinge."
                }}
            }},
            {{
                "title": {{
                    "sv": "Var",
                    "en": "Where",
                    "code": "WHERE"
                }},
                "text": {{
                    "sv": "TEST Dalälven mellan Näs bruk och Gysinge",
                    "en": "TEST River Dalälven between Näs bruk and Gysinge"
                }}
            }}
        ],
        "warningAreas": [
            {{
                "id": 54,
                "approximateStart": "2021-09-16T22:00:00.000Z",
                "approximateEnd": "2021-09-17T22:00:00.000Z",
                "published": "2021-09-16T12:56:49.033Z",
                "normalProbability": true,
                "areaName": {{ "sv": "Essunga kommun", "en": "Essunga municipality" }},
                "warningLevel": {{
                    "sv": "Orange",
                    "en": "Orange",
                    "code": "ORANGE"
                }},
                "eventDescription": {{
                    "sv": "Översvämning",
                    "en": "Flooding",
                    "code": "FLOODING"
                }},
                "affectedAreas": [
                    {{
                        "id": 14,
                        "sv": "Västra Götalands län",
                        "en": "Västra Götaland County"
                    }}
                ],
                "descriptions": [
                    {{
                        "title": {{
                            "sv": "Vad händer",
                            "en": "What happens",
                            "code": "HAPPENS"
                        }},
                        "text": {{
                            "sv": "Översvämning av regionalt viktiga vägar\\nÖversvämning av mindre vägar",
                            "en": "Flooding of regional road infrastructure\\nFlooding of local road infrastructure"
                        }}
                    }}
                ],
                "area": {{
                    "type": "Feature",
                    "geometry": {{
                        "type": "Polygon",
                        "coordinates": [
                            [
                                [12.80222259174195, 58.28964987510611],
                                [12.810328446528846, 58.29652740979712],
                                [12.827375241329335, 58.29681823412965],
                                [12.829710680662497, 58.25867359966897],
                                [12.804168046395064, 58.25823715820963],
                                [12.80222259174195, 58.28964987510611]
                            ]
                        ]
                    }}
                }}
            }}
        ]
    }}
]
"""
