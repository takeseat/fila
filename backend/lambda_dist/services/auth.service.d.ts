import { RegisterInput, LoginInput } from '../validators/auth.validator';
export declare class AuthService {
    register(data: RegisterInput): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
            restaurantId: string;
            language: string;
        };
        restaurant: {
            id: string;
            name: string;
            tradeName: string | null;
            cnpj: string | null;
            phone: string | null;
            email: string | null;
            countryCode: string | null;
            stateCode: string | null;
            city: string;
            addressLine: string | null;
            addressNumber: string | null;
            addressComplement: string | null;
            postalCode: string | null;
            timezone: string;
            createdAt: Date;
            updatedAt: Date;
            waitingAlertMinutes: number | null;
            calledAlertMinutes: number | null;
            avgWaitWindowMinutes: number | null;
            avgWaitFallbackMinutes: number | null;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    login(data: LoginInput): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
            restaurantId: string;
            language: string;
        };
        restaurant: {
            id: string;
            name: string;
            tradeName: string | null;
            cnpj: string | null;
            phone: string | null;
            email: string | null;
            countryCode: string | null;
            stateCode: string | null;
            city: string;
            addressLine: string | null;
            addressNumber: string | null;
            addressComplement: string | null;
            postalCode: string | null;
            timezone: string;
            createdAt: Date;
            updatedAt: Date;
            waitingAlertMinutes: number | null;
            calledAlertMinutes: number | null;
            avgWaitWindowMinutes: number | null;
            avgWaitFallbackMinutes: number | null;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    refreshToken(token: string): Promise<{
        accessToken: string;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map