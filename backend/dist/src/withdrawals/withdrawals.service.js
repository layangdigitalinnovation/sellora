"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
let WithdrawalsService = class WithdrawalsService {
    prisma;
    configService;
    FEE = 3500;
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
    }
    async updateBankDetails(userId, data) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                bankName: data.bankName,
                accountNumber: data.accountNumber,
                accountHolder: data.accountHolder,
            },
            select: {
                id: true,
                bankName: true,
                accountNumber: true,
                accountHolder: true,
            }
        });
    }
    async getWithdrawals(userId) {
        return this.prisma.withdrawal.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
    }
    async requestWithdrawal(userId, amount) {
        if (amount <= this.FEE) {
            throw new common_1.BadRequestException(`Amount must be greater than the fee of Rp ${this.FEE}`);
        }
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (!user.bankName || !user.accountNumber || !user.accountHolder) {
            throw new common_1.BadRequestException('Bank account details are not set');
        }
        if (user.balance < amount) {
            throw new common_1.BadRequestException('Insufficient balance');
        }
        const netAmount = amount - this.FEE;
        const withdrawal = await this.prisma.$transaction(async (prisma) => {
            await prisma.user.update({
                where: { id: userId },
                data: { balance: { decrement: amount } }
            });
            return prisma.withdrawal.create({
                data: {
                    userId,
                    amount,
                    fee: this.FEE,
                    netAmount,
                    bankName: user.bankName,
                    accountNumber: user.accountNumber,
                    accountHolder: user.accountHolder,
                    status: 'PROCESSING'
                }
            });
        });
        const secretKey = this.configService.get('XENDIT_API_KEY');
        if (!secretKey)
            throw new Error('XENDIT_API_KEY is not configured');
        const authString = Buffer.from(`${secretKey}:`).toString('base64');
        try {
            const response = await fetch('https://api.xendit.co/disbursements', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${authString}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    external_id: `withdraw_${withdrawal.id}`,
                    amount: netAmount,
                    bank_code: user.bankName,
                    account_holder_name: user.accountHolder,
                    account_number: user.accountNumber,
                    description: 'Sellora Instant Payout'
                })
            });
            const xenditData = await response.json();
            if (!response.ok) {
                throw new Error(xenditData.message || 'Failed to disburse');
            }
            return this.prisma.withdrawal.update({
                where: { id: withdrawal.id },
                data: { status: 'COMPLETED', processedAt: new Date() }
            });
        }
        catch (error) {
            console.error('Xendit disbursement error:', error);
            await this.prisma.$transaction([
                this.prisma.user.update({
                    where: { id: userId },
                    data: { balance: { increment: amount } }
                }),
                this.prisma.withdrawal.update({
                    where: { id: withdrawal.id },
                    data: { status: 'FAILED' }
                })
            ]);
            throw new common_1.BadRequestException('Disbursement failed: ' + error.message);
        }
    }
};
exports.WithdrawalsService = WithdrawalsService;
exports.WithdrawalsService = WithdrawalsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], WithdrawalsService);
//# sourceMappingURL=withdrawals.service.js.map