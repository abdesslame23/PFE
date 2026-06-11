$exercises = @(
  @{ name = "barbell-curl"; url = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0031-25GPyDY.gif" },
  @{ name = "dumbbell-curl"; url = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0294-NbVPDMW.gif" },
  @{ name = "hammer-curl"; url = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0313-slDvUAU.gif" },
  @{ name = "concentration-curl"; url = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0297-gvsWLQw.gif" },
  @{ name = "dips"; url = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0814-X6C6i5Y.gif" },
  @{ name = "tricep-extension"; url = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/2188-kont8Ut.gif" },
  @{ name = "pushdown"; url = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0201-3ZflifB.gif" },
  @{ name = "diamond-pushups"; url = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0283-soIB2rj.gif" },
  @{ name = "barbell-bench-press"; url = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0025-EIeI8Vf.gif" },
  @{ name = "incline-bench-press"; url = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0047-3TZduzM.gif" },
  @{ name = "dumbbell-flyes"; url = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0308-yz9nUhF.gif" },
  @{ name = "cable-crossover"; url = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/1269-UKWTJWR.gif" },
  @{ name = "pull-ups"; url = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0652-lBDjFxJ.gif" },
  @{ name = "barbell-rows"; url = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0027-eZyBC3j.gif" },
  @{ name = "lat-pulldown"; url = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/2330-LEprlgG.gif" },
  @{ name = "deadlift"; url = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0032-ila4NZS.gif" },
  @{ name = "overhead-press"; url = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/1456-wdRZISl.gif" },
  @{ name = "lateral-raise"; url = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0334-DsgkuIt.gif" },
  @{ name = "reverse-fly"; url = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0383-EAs3xL9.gif" },
  @{ name = "shrugs"; url = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0406-NJzBsGJ.gif" },
  @{ name = "barbell-squat"; url = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0043-qXTaZnJ.gif" },
  @{ name = "leg-press"; url = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0739-10Z2DXU.gif" },
  @{ name = "lunges"; url = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/1460-IZVHb27.gif" },
  @{ name = "leg-extension"; url = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0585-my33uHU.gif" },
  @{ name = "leg-curl"; url = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0586-17lJ1kr.gif" },
  @{ name = "plank"; url = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/2135-VBAWRPG.gif" },
  @{ name = "cable-crunch"; url = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0175-WW95auq.gif" },
  @{ name = "leg-raise"; url = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0620-WhuFnR7.gif" },
  @{ name = "russian-twist"; url = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0687-XVDdcoj.gif" },
  @{ name = "standing-calf-raise"; url = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/1372-8ozhUIZ.gif" },
  @{ name = "seated-calf-raise"; url = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/master/videos/0594-bOOdeyc.gif" }
)

Write-Host "Verifying new mapped URLs..." -ForegroundColor Cyan

$allPass = $true
foreach ($ex in $exercises) {
    try {
        $response = Invoke-WebRequest -Uri $ex.url -Method Head -TimeoutSec 10 -ErrorAction Stop
        $statusCode = $response.StatusCode
        if ($statusCode -eq 200) {
            Write-Host "✅ [200] $($ex.name)" -ForegroundColor Green
        } else {
            Write-Host "❌ [$statusCode] $($ex.name) - $($ex.url)" -ForegroundColor Red
            $allPass = $false
        }
    } catch {
        Write-Host "❌ [FAIL] $($ex.name) - Error: $($_.Exception.Message) - $($ex.url)" -ForegroundColor Red
        $allPass = $false
    }
}

if ($allPass) {
    Write-Host "`n🎉 ALL NEW MAPPED URLs ARE VALID (200 OK)!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️ SOME NEW MAPPED URLs FAILED!" -ForegroundColor Yellow
}
