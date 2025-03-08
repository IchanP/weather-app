from WarningFetcherApp.services.SMHIWarningPoller import SMHIWarningPoller
from .smhi_sanitize_strings import build_event_data

BASE_EVENT_ID = 6
BASE_EVENT_CODE = "FLOODING"
BASE_EVENT_MHO_CODE = "HYD"
BASE_EVENT_AREA_NAME = "TEST Vänern"
WARNING_AREA_ID = 2
WARNING_AREA_EVENT_DESCRIPTION = "Översvämning"
WARNING_AREA_AREA_NAME = "Essunga kommun"
WARNING_AREA_AREA_TYPE = "Feature"
smhi_response_data = build_event_data(BASE_EVENT_ID, BASE_EVENT_AREA_NAME, BASE_EVENT_CODE, BASE_EVENT_MHO_CODE, 
                                      WARNING_AREA_ID, WARNING_AREA_EVENT_DESCRIPTION, WARNING_AREA_AREA_NAME, 
                                      WARNING_AREA_AREA_TYPE)

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
    assert response[0].warningAreas[0].id == WARNING_AREA_ID
    assert response[0].warningAreas[0].eventDescription.sv == WARNING_AREA_EVENT_DESCRIPTION
    assert response[0].warningAreas[0].areaName.sv == WARNING_AREA_AREA_NAME
    assert response[0].warningAreas[0].area.type == WARNING_AREA_AREA_TYPE
    # Assert nested object length
    assert len(response[0].descriptions) == 2
    assert len(response[0].warningAreas[0].affectedAreas) == 1
    assert len(response[0].warningAreas[0].descriptions) == 1
    assert len(response[0].warningAreas[0].area.geometry.coordinates[0]) == 6
    # Assert optional fields do not exist
    assert response[0].warningAreas[0].area.properties == None
