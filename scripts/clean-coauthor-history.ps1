# Remove Co-authored-by: Cursor de TODO o historico git e sugere force push.
# Execute na raiz: powershell -ExecutionPolicy Bypass -File scripts/clean-coauthor-history.ps1

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$git = "C:\Program Files\Git\mingw64\bin\git.exe"
$bash = "C:\Program Files\Git\bin\bash.exe"

function Get-CoauthorCount {
    param([string]$Repo)
    $count = 0
    & $git -C $Repo rev-list --all | ForEach-Object {
        $body = & $git -C $Repo log -1 --format="%B" $_
        if ($body -match '(?i)Co-authored-by:.*cursor') { $script:count++ }
    }
    return $count
}

Push-Location $repoRoot
try {
    $before = Get-CoauthorCount -Repo $repoRoot
    Write-Host "Commits com Co-authored-by Cursor (antes): $before"

    if ($before -eq 0) {
        Write-Host "Historico ja limpo. Nenhuma reescrita necessaria."
    } else {
        $filterCmd = @'
export FILTER_BRANCH_SQUELCH_WARNING=1
cd "$1"
"/c/Program Files/Git/mingw64/bin/git.exe" filter-branch -f --msg-filter "sed -E '/^Co-authored-by:.*[Cc][Uu][Rr][Ss][Oo][Rr]/Id; /^Co-authored-by:.*cursoragent/Id'" -- --all
"/c/Program Files/Git/mingw64/bin/git.exe" for-each-ref --format="%(refname)" refs/original/ | while read ref; do "/c/Program Files/Git/mingw64/bin/git.exe" update-ref -d "$ref"; done
"/c/Program Files/Git/mingw64/bin/git.exe" reflog expire --expire=now --all
"/c/Program Files/Git/mingw64/bin/git.exe" gc --prune=now
'@
        & $bash -lc $filterCmd.Replace('$1', ($repoRoot -replace '\\', '/'))
    }

    $after = Get-CoauthorCount -Repo $repoRoot
    Write-Host "Commits com Co-authored-by Cursor (depois): $after"

    if ($after -gt 0) {
        throw "Ainda existem commits com co-autoria. Revise manualmente."
    }

    Write-Host ""
    Write-Host "Para publicar historico limpo no GitHub:"
    Write-Host "  & '$git' -C '$repoRoot' push --force origin master:main"
    Write-Host "  (ou: git push --force origin main)"
} finally {
    Pop-Location
}
