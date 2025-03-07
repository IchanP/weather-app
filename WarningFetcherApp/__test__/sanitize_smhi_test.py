from WarningFetcherApp.services.SMHIWarningPoller import SMHIWarningPoller
from .smhi_sanitize_strings import build_event_data

BASE_EVENT_ID = 6
BASE_EVENT_CODE = "FLOODING"
BASE_EVENT_MHO_CODE = "HYD"
BASE_EVENT_AREA_NAME = "TEST Vänern"

smhi_response_data = build_event_data(BASE_EVENT_ID, BASE_EVENT_AREA_NAME, BASE_EVENT_CODE, BASE_EVENT_MHO_CODE)

# TODO - Keep reading this https://datatracker.ietf.org/doc/html/rfc7946
def test_sanitize_smhi_data():
    poller = SMHIWarningPoller()
    response = poller._sanitize_smhi_data(smhi_response_data)
    # Test critical fields
    assert response[0].id == 6
    assert response[0].event.code == BASE_EVENT_CODE
    # Test nested object
    assert response[0].event.mhoClassification.code == BASE_EVENT_MHO_CODE
    assert response[0].areaName.sv == BASE_EVENT_AREA_NAME
    assert len(response[0].descriptions) == 2
    # Assert optional fields do not exist
    assert response[0].warningAreas[0].area.properties == None