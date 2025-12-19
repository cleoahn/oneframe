# 개발 서버 자동 재시작 스크립트
param(
    [int]$maxRetries = 10,
    [int]$retryDelay = 2
)

$ErrorActionPreference = "Stop"
$retryCount = 0
$ports = @(5173, 5174, 5175, 5176, 5177, 5178, 5179, 5180)

function Test-Port {
    param([int]$port)
    try {
        $tcpClient = New-Object System.Net.Sockets.TcpClient
        $result = $tcpClient.BeginConnect("localhost", $port, $null, $null)
        $success = $result.AsyncWaitHandle.WaitOne(100, $false)
        if ($success) {
            $tcpClient.EndConnect($result)
        }
        $tcpClient.Close()
        return $success
    } catch {
        return $false
    }
}

function Get-AvailablePort {
    foreach ($port in $ports) {
        if (-not (Test-Port $port)) {
            return $port
        }
    }
    return $null
}

function Start-DevServer {
    $availablePort = Get-AvailablePort
    if (-not $availablePort) {
        Write-Host "사용 가능한 포트를 찾을 수 없습니다." -ForegroundColor Red
        return $false
    }
    
    Write-Host "포트 $availablePort 에서 개발 서버를 시작합니다..." -ForegroundColor Green
    
    try {
        $env:VITE_PORT = $availablePort
        npm run dev -- --port $availablePort
        return $true
    } catch {
        Write-Host "서버 시작 실패: $_" -ForegroundColor Red
        return $false
    }
}

Write-Host "개발 서버 자동 재시작 스크립트 시작" -ForegroundColor Cyan
Write-Host "서버가 중지되면 자동으로 재시작됩니다." -ForegroundColor Yellow

while ($retryCount -lt $maxRetries) {
    try {
        $success = Start-DevServer
        if ($success) {
            $retryCount = 0  # 성공하면 재시도 횟수 초기화
        } else {
            $retryCount++
        }
    } catch {
        Write-Host "오류 발생: $_" -ForegroundColor Red
        $retryCount++
    }
    
    if ($retryCount -lt $maxRetries) {
        Write-Host "$retryDelay 초 후에 다시 시도합니다... (시도 $retryCount/$maxRetries)" -ForegroundColor Yellow
        Start-Sleep -Seconds $retryDelay
    }
}

Write-Host "최대 재시도 횟수를 초과했습니다. 스크립트를 종료합니다." -ForegroundColor Red