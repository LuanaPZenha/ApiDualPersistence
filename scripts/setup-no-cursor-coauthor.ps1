# Configura protecao contra Co-authored-by: Cursor neste repositorio.
# Execute: powershell -ExecutionPolicy Bypass -File scripts/setup-no-cursor-coauthor.ps1

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$git = "C:\Program Files\Git\mingw64\bin\git.exe"
$hookPath = Join-Path $repoRoot ".git\hooks\prepare-commit-msg"
$hookScript = Join-Path $repoRoot "scripts\strip-cursor-coauthor.sh"

if (-not (Test-Path (Join-Path $repoRoot ".git"))) {
    throw "Diretorio .git nao encontrado. Execute na raiz do repositorio."
}

$hookContent = @"
#!/bin/sh
# Remove co-autoria do Cursor antes de cada commit.
SCRIPT="$($hookScript -replace '\\','/')"
if [ -f "`$SCRIPT" ]; then
  sh "`$SCRIPT" "`$1" "`$2" "`$3"
else
  sed -i -E '/^Co-authored-by:.*[Cc][Uu][Rr][Ss][Oo][Rr]/Id; /^Co-authored-by:.*cursoragent/Id' "`$1"
fi
exit 0
"@

Set-Content -Path $hookPath -Value $hookContent -Encoding UTF8
Write-Host "Hook instalado: $hookPath"

# Torna executavel via Git Bash
& $git -C $repoRoot update-index --chmod=+x .git/hooks/prepare-commit-msg 2>$null

# Cursor CLI: desativa atribuicao automatica
$cliConfig = Join-Path $env:USERPROFILE ".cursor\cli-config.json"
if (Test-Path $cliConfig) {
    $json = Get-Content $cliConfig -Raw | ConvertFrom-Json
    if (-not $json.attribution) { $json | Add-Member -NotePropertyName attribution -NotePropertyValue ([pscustomobject]@{}) }
    $json.attribution | Add-Member -NotePropertyName attributeCommitsToAgent -NotePropertyValue $false -Force
    $json.attribution | Add-Member -NotePropertyName attributePRsToAgent -NotePropertyValue $false -Force
    $json | ConvertTo-Json -Depth 10 | Set-Content $cliConfig -Encoding UTF8
    Write-Host "Atualizado: $cliConfig (attributeCommitsToAgent=false)"
} else {
    Write-Host "Arquivo nao encontrado: $cliConfig (crie manualmente se usar Cursor CLI)"
}

Write-Host ""
Write-Host "IMPORTANTE: no Cursor IDE, desative manualmente:"
Write-Host "  Cursor Settings > Agents > Attribution > Commit Attribution = OFF"
Write-Host "  Reinicie o Cursor completamente apos alterar."
Write-Host ""
Write-Host "Para limpar historico remoto com co-autoria antiga:"
Write-Host "  powershell -ExecutionPolicy Bypass -File scripts/clean-coauthor-history.ps1"
