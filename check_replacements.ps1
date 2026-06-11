$urls = @(
  @{ id = "lunges"; url = "https://media.tenor.com/sZ7VwZ6jrbcAAAAC/gym.gif" },
  @{ id = "leg-raise"; url = "https://media.tenor.com/LuTjJGyFOoUAAAAC/hanging-leg-raise.gif" },
  @{ id = "russian-twist-v1"; url = "https://media.tenor.com/CDPw-TWiE5oAAAAC/fitness-ifafit.gif" },
  @{ id = "russian-twist-v2"; url = "https://media.tenor.com/09zEdCGXxdcAAAAC/adbminal.gif" },
  @{ id = "standing-calf-raise"; url = "https://media.tenor.com/JYsGi3a3Y_4AAAAC/single-leg-calf-raise.gif" },
  @{ id = "seated-calf-raise"; url = "https://media.tenor.com/dE7yo5T973EAAAAC/calves-raise.gif" }
)

foreach ($u in $urls) {
    try {
        $resp = Invoke-WebRequest -Uri $u.url -Method Head -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
        Write-Host "✅ [$($u.id)] HTTP $($resp.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "❌ [$($u.id)] FAIL - $($u.url)" -ForegroundColor Red
    }
}
