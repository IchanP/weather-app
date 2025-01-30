using System.ComponentModel.DataAnnotations;
namespace CurrentWeatherAPI.src.services
{
    public class ObjectValidator()
    {
        public static void ValidateObject(object obj)
        {
            var validationContext = new ValidationContext(obj);
            var validationResults = new List<ValidationResult>();
            bool isValid = Validator.TryValidateObject(obj, validationContext, validationResults, true);

            if (!isValid)
            {
                throw new ValidationException("Validation failed: " + string.Join(", ", validationResults.Select(v => v.ErrorMessage)));
            }
        }
    }
}
