from pytest_mock import MockerFixture
from requests import HTTPError
from ..services.SMHIWarningPoller import SMHIWarningPoller
from pytest import raises
import inspect

# Need the fully qualified path to satisfy .patch()
module_path = inspect.getmodule(SMHIWarningPoller).__name__
poller = SMHIWarningPoller()

def test_fetch_and_parse_weather_throws_value_error(mocker: MockerFixture):
    mock_response = setup_mock_response(mocker, 404)
    mock_response.reason = "Not Found"


    mocker.patch(f"{module_path}.get", return_value=mock_response)

    with raises(ValueError, match=f"Client Error: {mock_response.status_code} - {mock_response.reason}"):
        poller.fetch_and_parse_weather_data("http://example.com")

def test_fetch_and_parse_weather_throws_http_500(mocker: MockerFixture):
    mock_response = setup_mock_response(mocker, 500)

    mocker.patch(f"{module_path}.get", return_value=mock_response)
    with raises(HTTPError):
        poller.fetch_and_parse_weather_data("http://example.com")

def test_fetch_and_parse_weather_returns_json(mocker: MockerFixture):
    mock_response = mocker.Mock()
    mock_response.status_code = 200
    mock_response.text = '[ {"one" : "1", "two" : "2", "three" : "3"} ]'

    mocker.patch(f"{module_path}.get", return_value=mock_response)
    
    parsed_dict = poller.fetch_and_parse_weather_data("http://example.com")
    assert parsed_dict[0]["one"] == "1"
    assert parsed_dict[0]["two"] == "2"
    assert parsed_dict[0]["three"] == "3"



def setup_mock_response(mocker: MockerFixture, error_code: int):
    mock_response = mocker.Mock()
    mock_response.status_code = error_code
    http_error = HTTPError(response=mock_response)
    mock_response.raise_for_status.side_effect = http_error
    return mock_response