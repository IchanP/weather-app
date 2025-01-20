
namespace CurrentWeatherAPI.src.util
{
    public class Timer()
    {
        public static TimeSpan CreateTimeSpanOffset(int hours, int minutes, DateTime now)
        {
            DateTime nextRunTime = now.Date.AddHours(now.Hour + hours).AddMinutes(minutes);
            return nextRunTime - now;
        }
    }
}