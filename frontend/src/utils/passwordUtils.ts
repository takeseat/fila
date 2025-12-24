/**
 * Password strength validation utilities
 */

export interface PasswordStrength {
    score: number; // 0-4
    feedback: string[];
    isStrong: boolean;
}

/**
 * Validate password strength
 * Returns score from 0 (very weak) to 4 (very strong)
 */
export function validatePasswordStrength(password: string): PasswordStrength {
    const feedback: string[] = [];
    let score = 0;

    // Minimum length check
    if (password.length >= 8) {
        score++;
    } else {
        feedback.push('At least 8 characters');
    }

    // Uppercase letter check
    if (/[A-Z]/.test(password)) {
        score++;
    } else {
        feedback.push('One uppercase letter');
    }

    // Lowercase letter check
    if (/[a-z]/.test(password)) {
        score++;
    } else {
        feedback.push('One lowercase letter');
    }

    // Number check
    if (/\d/.test(password)) {
        score++;
    } else {
        feedback.push('One number');
    }

    // Special character check
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        score++;
    } else {
        feedback.push('One special character (!@#$%...)');
    }

    // Bonus: very long password
    if (password.length >= 12) {
        score = Math.min(score + 1, 4);
    }

    const isStrong = score >= 4;

    return { score, feedback, isStrong };
}

/**
 * Get password strength label
 */
export function getPasswordStrengthLabel(score: number): string {
    switch (score) {
        case 0:
        case 1:
            return 'Very Weak';
        case 2:
            return 'Weak';
        case 3:
            return 'Good';
        case 4:
        case 5:
            return 'Strong';
        default:
            return 'Very Weak';
    }
}

/**
 * Get password strength color
 */
export function getPasswordStrengthColor(score: number): string {
    switch (score) {
        case 0:
        case 1:
            return 'bg-red-500';
        case 2:
            return 'bg-orange-500';
        case 3:
            return 'bg-yellow-500';
        case 4:
        case 5:
            return 'bg-green-500';
        default:
            return 'bg-gray-300';
    }
}

/**
 * Get password strength text color
 */
export function getPasswordStrengthTextColor(score: number): string {
    switch (score) {
        case 0:
        case 1:
            return 'text-red-600';
        case 2:
            return 'text-orange-600';
        case 3:
            return 'text-yellow-600';
        case 4:
        case 5:
            return 'text-green-600';
        default:
            return 'text-gray-600';
    }
}
