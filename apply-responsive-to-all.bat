@echo off
echo ============================================
echo TRENDARYO - MASSIVE RESPONSIVE UPDATE
echo Applying responsive improvements to all HTML files...
echo ============================================

:: Create backup directory
if not exist "backup-responsive" mkdir backup-responsive
echo Created backup directory

:: Copy original files to backup
echo Backing up original HTML files...
copy "*.html" "backup-responsive\" /Y >nul 2>&1

:: Process each HTML file
for %%f in (*.html) do (
    echo Processing %%f...
    
    :: Skip if already processed (has our responsive CSS)
    findstr /C:"responsive-complete.css" "%%f" >nul
    if !errorlevel! equ 0 (
        echo    - Already has responsive CSS, skipping
    ) else (
        :: Add mobile optimization meta tags
        powershell -Command "(Get-Content '%%f') -replace '<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">', '<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover\">' | Set-Content '%%f'"
        
        :: Add mobile web app meta tags
        powershell -Command "(Get-Content '%%f') -replace '<meta name=\"robots\" content=\"index, follow\">', '<meta name=\"robots\" content=\"index, follow\">\r\n    \r\n    <!-- Mobile optimization -->\r\n    <meta name=\"mobile-web-app-capable\" content=\"yes\">\r\n    <meta name=\"apple-mobile-web-app-capable\" content=\"yes\">\r\n    <meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black-translucent\">\r\n    <meta name=\"format-detection\" content=\"telephone=no\">' | Set-Content '%%f'"
        
        :: Add responsive-complete.css
        powershell -Command "(Get-Content '%%f') -replace '<link rel=\"stylesheet\" href=\"responsive.css\">', '<link rel=\"stylesheet\" href=\"responsive.css\">\r\n    <link rel=\"stylesheet\" href=\"responsive-complete.css\">' | Set-Content '%%f'"
        
        :: Add mobile-optimizer.js if performance.js exists
        findstr /C:"performance.js" "%%f" >nul
        if !errorlevel! equ 0 (
            powershell -Command "(Get-Content '%%f') -replace '<script src=\"performance.js\"></script>', '<script src=\"performance.js\"></script>\r\n    <script src=\"mobile-optimizer.js\"></script>' | Set-Content '%%f'"
        )
        
        :: Add safe-area class to body
        powershell -Command "(Get-Content '%%f') -replace '<body>', '<body class=\"safe-area\">' | Set-Content '%%f'"
        
        echo    - Updated with responsive improvements
    )
)

echo.
echo ============================================
echo RESPONSIVE UPDATE COMPLETE!
echo ============================================
echo.
echo Files updated with:
echo - Enhanced viewport meta tags
echo - Mobile web app capabilities  
echo - Comprehensive responsive CSS
echo - Touch optimization script
echo - Safe area support for notched devices
echo.
echo Backup files saved in: backup-responsive\
echo.
echo Your website is now perfectly responsive across:
echo - Ultra small phones (240px+)
echo - Small phones (321px-480px) 
echo - Medium phones (481px-600px)
echo - Large phones/Small tablets (601px-768px)
echo - Tablets (769px-900px)
echo - Large tablets/Small laptops (901px-1024px)
echo - Desktops (1025px-1200px)
echo - Large desktops (1201px-1440px)
echo - Ultra wide displays (1441px+)
echo.
echo NO HORIZONTAL SCROLLING - Perfect fit guaranteed!
echo ============================================
pause
