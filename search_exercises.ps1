$jsonPath = "C:\Users\PC G.M.T\.gemini\antigravity-ide\brain\5add88ed-7041-4758-84a5-aca5fc2e2de8\.system_generated\steps\88\content.md"

$content = Get-Content $jsonPath
$jsonStartIndex = 0
for ($i = 0; $i -lt $content.Length; $i++) {
    if ($content[$i] -eq "---") {
        $jsonStartIndex = $i + 1
        break
    }
}

$jsonText = $content[$jsonStartIndex..($content.Length - 1)] -join "`n"
$exercises = ConvertFrom-Json $jsonText

$targets = @(
  "barbell curl", "dumbbell curl", "hammer curl", "concentration curl",
  "dips", "tricep extension", "pushdown", "diamond push",
  "bench press", "dumbbell fly", "cable crossover", "cable fly",
  "pull-up", "chin-up", "barbell row", "bent over row", "lat pulldown", "deadlift",
  "overhead press", "military press", "lateral raise", "reverse fly", "rear delt", "shrug",
  "squat", "leg press", "lunge", "leg extension", "leg curl",
  "plank", "cable crunch", "leg raise", "russian twist", "calf raise"
)

Write-Host "Searching for exercise matches..." -ForegroundColor Cyan

foreach ($target in $targets) {
    Write-Host "`n🔍 Searching for: $target" -ForegroundColor Yellow
    $matches = $exercises | Where-Object { $_.name -like "*$target*" }
    foreach ($m in $matches) {
        $name = $m.name
        $id = $m.id
        $tgt = $m.target
        $gif = $m.gif_url
        Write-Host "  - Name: $name | ID: $id | Target: $tgt | Gif: $gif" -ForegroundColor Green
    }
}
