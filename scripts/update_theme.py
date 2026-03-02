import re

with open('style.css', 'r') as f:
    css = f.read()

# Replace variables
css = css.replace('--gold:', '--silver:')
css = css.replace('--gold-light:', '--silver-light:')
css = css.replace('var(--gold)', 'var(--silver)')
css = css.replace('var(--gold-light)', 'var(--silver-light)')

# Update root variables
css = css.replace('--silver: #d4af37;', '--silver: #8a8d91;')
css = css.replace('--silver-light: #f3e5ab;', '--silver-light: #e2e4e6;')
# Invert dark/light for a white theme.
css = css.replace('--dark: #0a0a0a;', '--dark: #ffffff;')
css = css.replace('--light: #fefefe;', '--light: #333333;')

# Glass background -> white frosted glass
css = css.replace('--glass-bg: rgba(10, 10, 10, 0.65);', '--glass-bg: rgba(255, 255, 255, 0.85);')
css = css.replace('--glass-border: rgba(255, 255, 255, 0.15);', '--glass-border: rgba(138, 141, 145, 0.3);')
css = css.replace('--glass-shadow: rgba(0, 0, 0, 0.5);', '--glass-shadow: rgba(0, 0, 0, 0.08);')

# Subtitle, host, date are light grey, make them darker
css = css.replace('#e0e0e0', '#666666')
css = css.replace('#bbb', '#777777')
css = css.replace('#eee', '#444444')
css = css.replace('#aaa', '#888888')

# Box shadows that used gold rgba(212, 175, 55, ...)
css = css.replace('rgba(212, 175, 55, ', 'rgba(138, 141, 145, ')

# CTA Button gradient
css = css.replace('linear-gradient(135deg, var(--silver) 0%, #b8860b 100%)', 'linear-gradient(135deg, var(--silver) 0%, #b0b4b8 100%)')
# CTA Text from black to white (since silver bg)
css = css.replace('color: #000;\n    border: none;', 'color: #fff;\n    border: none;')

# Timeline lines
css = css.replace('border-top: 1px solid rgba(255, 255, 255, 0.1);', 'border-top: 1px solid rgba(0, 0, 0, 0.1);')

# Input / Map Backgrounds
css = css.replace('background: rgba(0, 0, 0, 0.4);', 'background: rgba(255, 255, 255, 0.6);')
css = css.replace('background: rgba(0, 0, 0, 0.2);', 'background: rgba(255, 255, 255, 0.4);')
css = css.replace('border: 1px solid rgba(255, 255, 255, 0.08);', 'border: 1px solid rgba(138, 141, 145, 0.2);')
css = css.replace('border: 1px solid rgba(255, 255, 255, 0.15);', 'border: 1px solid rgba(138, 141, 145, 0.3);')

# Input text color
css = css.replace('color: #fff;', 'color: #333333;')
css = css.replace('color: rgba(255, 255, 255, 0.3);', 'color: rgba(0, 0, 0, 0.5);')

with open('style.css', 'w') as f:
    f.write(css)

print("Theme updated to white and silver.")
