import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(body: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            plan: any;
            role: any;
        };
    } | {
        status: number;
        message: string;
    }>;
    register(body: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            plan: any;
            role: any;
        };
    }>;
    getProfile(req: any): Promise<any>;
}
