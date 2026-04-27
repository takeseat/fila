/**
 * Password strength validation utilities
 */

export interface PasswordStrength {
    score: number; // 0-4
    feedback: string[];
    isStrong: boolean;
}

const COMMON_WEAK_PASSWORDS = [
    'password', '123456', '12345678', '123456789', 'qwerty', 'admin', 'welcome'
];

/**
 * Validate password strength
 * Returns score from 0 (very weak) to 4 (very strong)
 */
export function validatePasswordStrength(password: string, email?: string): PasswordStrength {
    const feedback: string[] = [];
    let score = 0;

    if (!password) {
        return { score: 0, feedback: [], isStrong: false };
    }

    // Common weak password check
    if (COMMON_WEAK_PASSWORDS.includes(password.toLowerCase())) {
        feedback.push('common');
        return { score: 0, feedback, isStrong: false };
    }

    // Email similarity check
    if (email && password.toLowerCase().includes(email.split('@')[0].toLowerCase())) {
        feedback.push('emailMatch');
        return { score: 0, feedback, isStrong: false };
    }

    // Minimum length check (10 chars for strong)
    if (password.length >= 10) {
        score++;
    } else {
        feedback.push('minLength');
    }

    // Uppercase letter check
    const hasUpper = /[A-Z]/.test(password);
    if (hasUpper) score++;
    else feedback.push('uppercase');

    // Lowercase letter check
    const hasLower = /[a-z]/.test(password);
    if (hasLower) score++;
    else feedback.push('lowercase');

    // Number check
    const hasNumber = /\d/.test(password);
    if (hasNumber) score++;
    else feedback.push('number');

    // Special character check
    // eslint-disable-next-line no-useless-escape
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    if (hasSpecial) score++;
    else feedback.push('special');

    // Rule: Must have 3 out of 4 complexity types + length
    // We base strictness on this.
    const complexityCount = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

    if (password.length < 10) {
        // Automatically weak if short
        // Force score low even if complexity is high
        return { score: Math.min(score, 1), feedback, isStrong: false };
    }

    if (complexityCount < 3) {
        // Weak if complexity not met
        feedback.push('complexity');
        return { score: 2, feedback, isStrong: false };
    }

    // If passed length and complexity
    return { score: 4, feedback: [], isStrong: true };
}

/**
 * Get password strength label
 */
export function getPasswordStrengthLabel(score: number): string {
    if (score <= 1) return 'veryWeak';
    if (score === 2) return 'weak';
    if (score === 3) return 'good';
    return 'strong';
}

export function getPasswordStrengthColor(score: number): string {
    if (score <= 1) return 'bg-red-500';
    if (score === 2) return 'bg-orange-500';
    if (score === 3) return 'bg-yellow-500';
    return 'bg-green-500';
}

export function getPasswordStrengthTextColor(score: number): string {
    if (score <= 1) return 'text-red-600';
    if (score === 2) return 'text-orange-600';
    if (score === 3) return 'text-yellow-600';
    return 'text-green-600';
}
