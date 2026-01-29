#!/usr/bin/env python3
"""
Script to replace hardcoded Tailwind classes with semantic Design System tokens
across all frontend files.
"""

import re
import os
from pathlib import Path

# Mapping of hardcoded classes to semantic tokens
REPLACEMENTS = {
    # Background colors
    r'\bbg-white\b': 'bg-bg-surface',
    r'\bbg-light-50\b': 'bg-bg-subtle',
    r'\bbg-light-100\b': 'bg-bg-subtle',
    r'\bbg-light-200\b': 'bg-bg-sunken',
    r'\bbg-dark-900\b': 'bg-text-primary',
    
    # Text colors
    r'\btext-dark-900\b': 'text-text-primary',
    r'\btext-dark-800\b': 'text-text-primary',
    r'\btext-dark-700\b': 'text-text-primary',
    r'\btext-dark-600\b': 'text-text-secondary',
    r'\btext-dark-500\b': 'text-text-secondary',
    r'\btext-dark-400\b': 'text-text-muted',
    r'\btext-dark-300\b': 'text-text-muted',
    
    # Border colors
    r'\bborder-light-200\b': 'border-border-default',
    r'\bborder-light-300\b': 'border-border-default',
    r'\bborder-dark-200\b': 'border-border-default',
    
    # Specific color utilities (preserve for gradients and special cases)
    # Primary colors (keep for backward compat where needed)
    # r'\bbg-primary-50\b': 'bg-action-primary-bg/10',
    # r'\bbg-primary-100\b': 'bg-action-primary-bg/20',
    
    # Card premium class
    r'\bcard-premium\b': 'bg-bg-surface border border-border-default rounded-card shadow-card',
}

def replace_in_file(file_path):
    """Replace hardcoded classes in a single file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        changes_made = False
        
        # Apply all replacements
        for pattern, replacement in REPLACEMENTS.items():
            new_content = re.sub(pattern, replacement, content)
            if new_content != content:
                changes_made = True
                content = new_content
        
        if changes_made:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    """Main function to process all TypeScript/TSX files."""
    frontend_dir = Path(__file__).parent
    src_dir = frontend_dir / 'src'
    
    if not src_dir.exists():
        print(f"Source directory not found: {src_dir}")
        return
    
    # Find all TSX and TS files (excluding node_modules and dist)
    files_to_process = []
    for ext in ['*.tsx', '*.ts']:
        files_to_process.extend(src_dir.rglob(ext))
    
    # Filter out build artifacts and dependencies
    files_to_process = [
        f for f in files_to_process 
        if 'node_modules' not in str(f) and 'dist' not in str(f)
    ]
    
    print(f"Found {len(files_to_process)} files to process")
    
    updated_count = 0
    for file_path in files_to_process:
        if replace_in_file(file_path):
            updated_count += 1
            print(f"✓ Updated: {file_path.relative_to(src_dir)}")
    
    print(f"\nCompleted! Updated {updated_count} files.")

if __name__ == '__main__':
    main()
