import { hash } from 'bcrypt';
import { DisplayableUser, User } from '@/modules/users/models/users.interface';
import { isEmpty } from '@/shared/utils/util';
import { IUserRepository } from '@/modules/users/repository/IUserRepository';
import { NotFound, ValidationError } from '@/shared/exceptions/exceptions';
import { CreateUserRequest, mapDisplayableUserToUserResponse, UserResponse } from '@/modules/users/api/users.model';
import { createWallet } from '@/shared/blockchain/wallet/Wallet';
import { Blockchain } from '@/shared/blockchain/model/blockchain.model';
import { File } from '@/shared/http/file';
import { IStorageService } from '@/shared/storage/storage';

class UserService {
    constructor(private userRepository: IUserRepository, private storageService: IStorageService) {}

    public async findAllUser(): Promise<UserResponse[]> {
        const mappedUsers = (await this.userRepository.findAll()).map(user =>
            mapDisplayableUserToUserResponse(user, this.storageService),
        );
        return await Promise.all(mappedUsers);
    }

    public async findUserById(userId: string): Promise<UserResponse> {
        if (isEmpty(userId)) {
            throw new ValidationError('Empty request!');
        }

        const user: User = await this.userRepository.findOneById(userId);
        if (!user) {
            throw new NotFound("User doesn't exist");
        }

        return mapDisplayableUserToUserResponse(user, this.storageService);
    }

    public async createUser(userData: CreateUserRequest): Promise<UserResponse> {
        if (isEmpty(userData)) {
            throw new ValidationError('Empty request!');
        }

        const findUser: DisplayableUser = await this.userRepository.findOneByEmail(userData.email);
        if (findUser) {
            throw new ValidationError({ email: `This email ${userData.email} already exists` });
        }

        const hashedPassword = await hash(userData.password, 10);
        // TODO centralise blockchain type
        const wallet = createWallet(Blockchain.GNOSIS);

        const user = await this.userRepository.create({
            ...userData,
            password: hashedPassword,
            wallet: {
                address: wallet.address(),
                keys: wallet.keys(),
            },
        });

        return mapDisplayableUserToUserResponse(user, this.storageService);
    }

    public async updateUser(userId: string, userData: CreateUserRequest): Promise<UserResponse> {
        if (isEmpty(userData)) {
            throw new ValidationError('Empty request!');
        }

        const findUser: User = await this.userRepository.findOneByEmail(userData.email);

        if (findUser && findUser._id.toString() === userId) {
            throw new ValidationError({ email: `This email ${userData.email} already exists` });
        }

        let updatedUserData = {
            ...findUser,
            ...userData,
        };
        if (userData.password) {
            const hashedPassword = await hash(userData.password, 10);
            updatedUserData = { ...updatedUserData, password: hashedPassword };
        }

        const user: User = await this.userRepository.updateOne(userId, updatedUserData);
        if (!user) {
            throw new NotFound("User doesn't exist");
        }
        return mapDisplayableUserToUserResponse(user, this.storageService);
    }

    public async updateUserProfilePicture(userId: string, file: File): Promise<UserResponse> {
        const result = await this.storageService.uploadFile('users/pictures', 'image.png', file.buffer());

        const user: User = await this.userRepository.updateUserPicture(userId, {
            picture: {
                urlPath: result.relativePath(),
                fileType: file.mimeType(),
            },
        });
        return mapDisplayableUserToUserResponse(user, this.storageService);
    }

    public async deleteUser(userId: string): Promise<void> {
        const user: User = await this.userRepository.findOneById(userId);
        if (!user) {
            throw new NotFound("User doesn't exist");
        }

        await this.userRepository.deleteOne(userId);
    }

    public async getUserWalletAddress(userId: string): Promise<string> {
        if (isEmpty(userId)) {
            throw new ValidationError('Empty request!');
        }
        const user: User = await this.userRepository.findOneById(userId);
        if (!user) {
            throw new NotFound("User doesn't exist");
        }
        return user.wallet.address;
    }
}

export default UserService;
