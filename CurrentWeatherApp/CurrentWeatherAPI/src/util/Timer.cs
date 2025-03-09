
namespace CurrentWeatherAPI.src.util
{
    public class Timer()
    {
        public static TimeSpan CreateTimeSpanOffset(int hours, int minutes, DateTime now)
        {
            int extraHour = 1;
            DateTime nextRunTime = now.Date.AddHours(now.Hour + hours).AddMinutes(minutes);
            if (nextRunTime <= now)
            {
                nextRunTime = nextRunTime.AddHours(extraHour); // Offset by 1 hour
            }
            return nextRunTime - now;
        }
    }
}