using System.Text.Json.Serialization;

namespace DoeVida.Api.Contract;

public class ValidationErrorItem
{
  [JsonPropertyName("field")]
  public string Field { get; set; } = string.Empty;
  [JsonPropertyName("message")]
  public string Message { get; set; } = string.Empty;
}
