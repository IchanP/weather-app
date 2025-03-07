from WarningFetcherApp.services.SMHIWarningPoller import SMHIWarningPoller

BASE_EVENT_ID = 6
BASE_EVENT_CODE = "FLOODING"
BASE_EVENT_MHO_CODE = "HYD"
BASE_EVENT_AREA_NAME = "TEST Vänern"
# NOTE - Double brackets are for escaping the bracket, I think
base_and_event_data = f"""
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
        }}
    }}
]
"""


def test_sanitize_smhi_data():
    poller = SMHIWarningPoller()
    response = poller._sanitize_smhi_data(base_and_event_data)
    # Test critical fields
    assert response[0].id == 6
    assert response[0].event.code == BASE_EVENT_CODE
    # Test nested object
    assert response[0].event.mhoClassification.code == BASE_EVENT_MHO_CODE
    assert response[0].areaName.sv == BASE_EVENT_AREA_NAME