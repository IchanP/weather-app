public interface IWeatherConverter<C, T>
{
    C ConvertToWriteableData(T data);
}