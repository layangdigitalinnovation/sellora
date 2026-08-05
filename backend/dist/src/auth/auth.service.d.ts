import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    getUserById(id: string): Promise<{
        id: string;
        email: string;
        referralCode: string | null;
        name: string;
        avatar: string | null;
        role: import("@prisma/client").$Enums.Role;
        plan: import("@prisma/client").$Enums.Plan;
        balance: number;
        pendingBalance: number;
        bankName: string | null;
        accountNumber: string | null;
        accountHolder: string | null;
        createdAt: Date;
        updatedAt: Date;
        referredById: string | null;
    } | null>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            plan: any;
            role: any;
        };
    }>;
    register(data: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            plan: any;
            role: any;
        };
    }>;
}
