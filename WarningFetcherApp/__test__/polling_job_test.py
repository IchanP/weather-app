from pytest_mock import MockerFixture
from requests import HTTPError
from ..services.PollingFacade import PollingFacade
from ..services.WebsocketManager import WebsocketManager
from ..services.SMHIWarningPoller import SMHIWarningPoller
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
import inspect

module_path = inspect.getmodule(PollingFacade).__name__
communicator = WebsocketManager()


def test_polling_job_refetches_after_delay(mocker: MockerFixture):
    scheduler = BackgroundScheduler()
    ex = HTTPError()
    mock_poller = setup_mock_poller(mocker, ex)

    add_job_mock = mocker.patch.object(scheduler, "add_job")
    
    facade = PollingFacade(communicator, mock_poller, scheduler, 100)
    
    # Mock the date_time of the call
    next_run_time = datetime.now() + timedelta(minutes=9)
    mocker.patch.object(facade, "_calculate_next_runtime", return_value=next_run_time)
    
    facade.polling_job()
    add_job_mock.assert_called_with(facade.polling_job, 'date', run_date=next_run_time)

def test_polling_job_logs_and_passes_on_unspecific_error(mocker: MockerFixture):
    scheduler = BackgroundScheduler()
    ex = NameError()
    mock_poller = setup_mock_poller(mocker, ex)

    facade = PollingFacade(communicator, mock_poller, scheduler, 100)
    error_log_mock = mocker.patch("logging.error")
    
    facade.polling_job()
    error_log_mock.assert_called_once_with(f"Unexpected error while polling {ex}")




def setup_mock_poller(mocker: MockerFixture, error: Exception):
    mock_poller = mocker.Mock()
    mock_poller.fetch_and_parse_weather_data.side_effect = error
    return mock_poller