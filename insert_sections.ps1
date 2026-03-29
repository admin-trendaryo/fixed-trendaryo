$lines = [System.IO.File]::ReadAllLines((Resolve-Path 'index.html'), [System.Text.Encoding]::UTF8)

# Find the line index of </section> that precedes "Shop by Category"
$insertAfter = -1
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match '^\s*</section>\s*$') {
        # Check if within next 5 lines there's "Shop by Category"
        for ($j = $i+1; $j -le [Math]::Min($i+6, $lines.Length-1); $j++) {
            if ($lines[$j] -match 'Shop by Category') {
                $insertAfter = $i
                break
            }
        }
        if ($insertAfter -ge 0) { break }
    }
}

Write-Output "Insert after line: $($insertAfter + 1)"

$newSections = @(
'',
'    <!-- HOLOGRAPHIC TESTIMONIALS -->',
'    <section id="testimonials">',
'        <div class="tst-inner">',
'            <div class="cs-eyebrow">&#10022; Reviews &#10022;</div>',
'            <h2 class="cs-title">Voices from the Stars</h2>',
'            <p class="cs-sub">Real customers. Real experiences. From across the galaxy.</p>',
'            <div class="tst-grid">',
'                <div class="hologram" data-quote="Amazing quality!">',
'                    <div class="holo-scan"></div>',
'                    <div class="holo-stars">&#11088;&#11088;&#11088;&#11088;&#11088;</div>',
'                    <div class="holo-quote">&ldquo;Amazing quality! Every product exceeded my expectations. This store is out of this world.&rdquo;</div>',
'                    <div class="holo-author"><div class="holo-avatar">&#128100;</div><div><div class="holo-name">Sarah K.</div><div class="holo-tag">Verified Buyer</div></div></div>',
'                </div>',
'                <div class="hologram" data-quote="Fast Shipping!">',
'                    <div class="holo-scan"></div>',
'                    <div class="holo-stars">&#11088;&#11088;&#11088;&#11088;&#11088;</div>',
'                    <div class="holo-quote">&ldquo;Fast shipping &mdash; arrived in two days. Premium packaging, exactly as described.&rdquo;</div>',
'                    <div class="holo-author"><div class="holo-avatar">&#128100;</div><div><div class="holo-name">Marcus T.</div><div class="holo-tag">Verified Buyer</div></div></div>',
'                </div>',
'                <div class="hologram" data-quote="Love this shop!">',
'                    <div class="holo-scan"></div>',
'                    <div class="holo-stars">&#11088;&#11088;&#11088;&#11088;&#11088;</div>',
'                    <div class="holo-quote">&ldquo;Love this shop! The cosmic theme, quality, and service are on another level. 10/10.&rdquo;</div>',
'                    <div class="holo-author"><div class="holo-avatar">&#128100;</div><div><div class="holo-name">Priya M.</div><div class="holo-tag">Verified Buyer</div></div></div>',
'                </div>',
'            </div>',
'        </div>',
'    </section>',
'',
'    <!-- BLACK HOLE FOOTER CTA -->',
'    <div id="blackhole">',
'        <div class="bh-ring bh-ring--1"></div>',
'        <div class="bh-ring bh-ring--2"></div>',
'        <div class="bh-ring bh-ring--3"></div>',
'        <div class="bh-core"></div>',
'        <div class="bh-inner">',
'            <div class="cs-eyebrow">&#10022; Connect &#10022;</div>',
'            <h2 class="bh-title">Enter the Void</h2>',
'            <p class="bh-sub">Follow us across the cosmos. Stay updated on drops, deals, and dispatches.</p>',
'            <div class="bh-icons">',
'                <a href="#" class="social-icon" data-icon="twitter" aria-label="Twitter"><span class="si-icon">&#128038;</span><span class="si-label">Twitter</span></a>',
'                <a href="#" class="social-icon" data-icon="instagram" aria-label="Instagram"><span class="si-icon">&#128248;</span><span class="si-label">Instagram</span></a>',
'                <a href="#" class="social-icon" data-icon="youtube" aria-label="YouTube"><span class="si-icon">&#9654;</span><span class="si-label">YouTube</span></a>',
'                <a href="contact.html" class="social-icon" data-icon="contact" aria-label="Contact"><span class="si-icon">&#9993;</span><span class="si-label">Contact</span></a>',
'            </div>',
'            <a href="shop.html" class="bh-cta">Launch Into Shop</a>',
'        </div>',
'    </div>',
''
)

$before = $lines[0..$insertAfter]
$after  = $lines[($insertAfter+1)..($lines.Length-1)]
$result = $before + $newSections + $after

[System.IO.File]::WriteAllLines((Resolve-Path 'index.html'), $result, [System.Text.Encoding]::UTF8)
Write-Output "Done - inserted $($newSections.Length) lines after line $($insertAfter + 1)"
