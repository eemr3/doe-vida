using System.Text.Json.Serialization;

namespace DoeVida.Api.Contract;

public class ApiErrorResponse
{
  [JsonPropertyName("type")]
  public string Type { get; set; } = string.Empty;
  [JsonPropertyName("message")]
  public string Message { get; set; } = string.Empty;
  [JsonPropertyName("errors")]
  public List<ValidationErrorItem>? Errors { get; set; }
}
