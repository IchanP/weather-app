
namespace CurrentWeatherAPI.tests;

using CurrentWeatherAPI.src.util;

using Xunit;

public class TimerTests
{

    private readonly DateTime spoofedTime = new DateTime(1990, 1, 1, 20, 10, 15);

    [Theory]
    [InlineData(1, 0)]  // 1 hour ahead
    [InlineData(2, 15)] // 2 hours and 15 minutes ahead
    public void CreateTimeSpanOffset_ShouldReturnCorrectOffset(int hours, int minutes)
    {
        DateTime now = DateTime.Now;
        DateTime expected = now.Date
            .AddHours(now.Hour + hours)
            .AddMinutes(minutes);

        TimeSpan result = Timer.CreateTimeSpanOffset(hours, minutes, now);
        TimeSpan expectedOffset = expected - now;
        Assert.True(Math.Abs(result.TotalMinutes - expectedOffset.TotalMinutes) < 1,
            $"Expected offset around {expectedOffset.TotalMinutes} minutes, but got {result.TotalMinutes}");
    }

    [Fact]
    public void CreateTimeSpanOffset_ShouldReturnZeroHourWhenInjectedWithOne()
    {

        TimeSpan result = Timer.CreateTimeSpanOffset(1, 0, spoofedTime);
        Assert.True(result.Hours == 0, $"Expected the hours passed in offset to equal 0. But got {result.Hours}.");
    }

    [Theory]
    [InlineData(1, 0)]
    [InlineData(3, 0)]
    [InlineData(5, 0)]
    [InlineData(9, 0)]
    public void CreateTimeSpanOffset_ShouldReturnInjectedHourMinusOne(int hour, int minute)
    {
        TimeSpan result = Timer.CreateTimeSpanOffset(hour, minute, spoofedTime);
        Assert.True(result.Hours == hour - 1, $"Expected the result.Hours to be equal to provided hour minus one. But got {result.Hours}.");
    }

    [Theory]
    [InlineData(0, 59)]
    [InlineData(0, 1)]
    [InlineData(0, 30)]
    public void CreateTimeSpanOffset_ShouldReturnZeroHourWhenGivenZeroHourArgument(int hour, int minute)
    {
        TimeSpan result = Timer.CreateTimeSpanOffset(hour, minute, spoofedTime);
        Assert.True(result.Hours == 0, $"Expected the result.Hours to equal 0. But got {result.Hours}");
    }

    [Theory]
    [InlineData("2024-01-01 10:30", 1, 11, 40)]
    [InlineData("2024-01-01 10:50", 1, 11, 40)]
    [InlineData("2024-01-01 11:00", 1, 12, 40)]
    public void CreateTimeSpanOffset_ReturnsCorrectDelay(string currentTime, int hour, int expectedHour, int expectedMinute)
    {
        DateTime now = DateTime.Parse(currentTime);
        TimeSpan result = Timer.CreateTimeSpanOffset(hour, 40, now);

        var expectedTime = new DateTime(2024, 1, 1, expectedHour, expectedMinute, 0);
        Assert.Equal(expectedTime - now, result);
    }
}