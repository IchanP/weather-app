from WarningFetcherApp.services.SMHIWarningPoller import SMHIWarningPoller
from .smhi_sanitize_strings import build_event_data
import json

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

poller = SMHIWarningPoller()


def test_sanitize_smhi_data():
    response = poller._sanitize_smhi_data(smhi_response_data)
    parsed_json = []
    parsed_json.append(json.loads(response[0]))
    # Test critical fields
    assert parsed_json[0]["id"] == 6
    assert parsed_json[0]["event"]["code"] == BASE_EVENT_CODE
    # Test nested object
    assert parsed_json[0]["event"]["mhoClassification"]["code"] == BASE_EVENT_MHO_CODE
    assert parsed_json[0]["areaName"]["sv"] == BASE_EVENT_AREA_NAME
    assert parsed_json[0]["warningAreas"][0]["id"] == WARNING_AREA_ID
    assert parsed_json[0]["warningAreas"][0]["eventDescription"]["sv"] == WARNING_AREA_EVENT_DESCRIPTION
    assert parsed_json[0]["warningAreas"][0]["areaName"]["sv"] == WARNING_AREA_AREA_NAME
    assert parsed_json[0]["warningAreas"][0]["area"]["type"] == WARNING_AREA_AREA_TYPE
    # Assert nested object length
    assert len(parsed_json[0]["descriptions"]) == 2
    assert len(parsed_json[0]["warningAreas"][0]["affectedAreas"]) == 1
    assert len(parsed_json[0]["warningAreas"][0]["descriptions"]) == 1
    assert len(parsed_json[0]["warningAreas"][0]["area"]["geometry"]["coordinates"][0]) == 6
    # Assert optional fields do not exist
    assert parsed_json[0]["warningAreas"][0]["area"]["properties"] == None


def test_sanitize_smhi_data_returns_unsanitized_on_failure():
    response = poller._sanitize_smhi_data('[ {"one" : "1", "two" : "2", "three" : "3"} ]')
    response_list = json.loads(response)
    assert hasattr(response_list[0], 'id') == False
    assert response_list[0]['one'] == '1'