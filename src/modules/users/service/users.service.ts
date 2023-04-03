import { hash } from 'bcrypt';
import { User } from '@/modules/users/models/users.interface';
import { isEmpty } from '@/shared/utils/util';
import { IUserRepository } from '@/modules/users/repository/IUserRepository';
import { NotFound, ValidationError } from '@/shared/exceptions/exceptions';
import { CreateUserRequest, UserResponse } from '@/modules/users/api/users.model';
import { createWallet } from '@/shared/blockchain/wallet/Wallet';
import { Blockchain } from '@/shared/blockchain/model/blockchain.model';

class UserService {
    constructor(private userRepository: IUserRepository) {}

    public async findAllUser(): Promise<UserResponse[]> {
        return (await this.userRepository.findAll()).map(user => ({
            _id: user._id.toString(),
            email: user.email,
        }));
    }

    public async findUserById(userId: string): Promise<UserResponse> {
        if (isEmpty(userId)) {
            throw new ValidationError('Empty request!');
        }

        const user: User = await this.userRepository.findOneById(userId);
        if (!user) {
            throw new NotFound("User doesn't exist");
        }

        return {
            _id: user._id.toString(),
            email: user.email,
        };
    }

    public async createUser(userData: CreateUserRequest): Promise<UserResponse> {
        if (isEmpty(userData)) {
            throw new ValidationError('Empty request!');
        }

        const findUser: User = await this.userRepository.findOneByEmail(userData.email);
        if (findUser) {
            throw new ValidationError({ email: `This email ${userData.email} already exists` });
        }

        const hashedPassword = await hash(userData.password, 10);
        // TODO centralise blockchain type
        const wallet = createWallet(Blockchain.POLYGON);

        const user = await this.userRepository.create({
            ...userData,
            password: hashedPassword,
            wallet: {
                address: wallet.address(),
                keys: wallet.keys(),
            },
        });

        return {
            _id: user._id.toString(),
            email: user.email,
        };
    }

    public async updateUser(userId: string, userData: CreateUserRequest): Promise<UserResponse> {
        if (isEmpty(userData)) {
            throw new ValidationError('Empty request!');
        }

        const findUser: User = await this.userRepository.findOneByEmail(userData.email);

        if (findUser && findUser._id.toString() === userId) {
            throw new ValidationError({ email: `This email ${userData.email} already exists` });
        }

        let updatedUserDate = {
            ...findUser,
            ...userData,
        };
        if (userData.password) {
            const hashedPassword = await hash(userData.password, 10);
            updatedUserDate = { ...updatedUserDate, password: hashedPassword };
        }

        const user: User = await this.userRepository.updateOne(userId, updatedUserDate);
        if (!user) {
            throw new NotFound("User doesn't exist");
        }
        return {
            _id: user._id.toString(),
            email: user.email,
        };
    }

    public async deleteUser(userId: string): Promise<void> {
        const user: User = await this.userRepository.findOneById(userId);
        if (!user) {
            throw new NotFound("User doesn't exist");
        }

        await this.userRepository.deleteOne(userId);
    }
}

export default UserService;
