namespace DoeVida.Application.UseCases.GetDonorById;

/// <summary>
/// Item do histórico de doações para a resposta de detalhe do doador.
/// </summary>
public class DonationRecordDto
{
    public DateTime Date { get; set; }
    public string Location { get; set; } = string.Empty;
}
