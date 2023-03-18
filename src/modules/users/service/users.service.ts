import { hash } from 'bcrypt';
import { User } from '@/modules/users/models/users.interface';
import { isEmpty } from '@/shared/utils/util';
import { IUserRepository } from '@/modules/users/repository/IUserRepository';
import { AlreadyExists, IllegalArgument, NotFound } from '@/shared/exceptions/exceptions';
import { CreateUserRequest } from '@/modules/users/api/users.model';

class UserService {
    constructor(private userRepository: IUserRepository) {}

    public async findAllUser(): Promise<User[]> {
        return await this.userRepository.findAll();
    }

    public async findUserById(userId: string): Promise<User> {
        if (isEmpty(userId)) {
            throw new IllegalArgument('UserId is empty');
        }

        const findUser: User = await this.userRepository.findOne({ _id: userId });
        if (!findUser) {
            throw new NotFound("User doesn't exist");
        }

        return findUser;
    }

    public async createUser(userData: CreateUserRequest): Promise<User> {
        if (isEmpty(userData)) {
            throw new IllegalArgument('userData is empty');
        }

        const findUser: User = await this.userRepository.findOne({ email: userData.email });
        if (findUser) {
            throw new AlreadyExists(userData.email, `This email ${userData.email} already exists`);
        }

        const hashedPassword = await hash(userData.password, 10);
        return await this.userRepository.create({ ...userData, password: hashedPassword });
    }

    public async updateUser(userId: string, userData: CreateUserRequest): Promise<User> {
        if (isEmpty(userData)) {
            throw new IllegalArgument('userData is empty');
        }

        if (userData.email) {
            const findUser: User = await this.userRepository.findOne({ email: userData.email });
            if (findUser && findUser._id.toString() != userId) {
                throw new AlreadyExists(userData.email, `This email ${userData.email} already exists`);
            }
        }

        if (userData.password) {
            const hashedPassword = await hash(userData.password, 10);
            userData = { ...userData, password: hashedPassword };
        }

        const updateUserById: User = await this.userRepository.updateOne({ userId }, { userData });
        if (!updateUserById) {
            throw new NotFound("User doesn't exist");
        }

        return updateUserById;
    }

    public async deleteUser(userId: string): Promise<User> {
        const deleteUserById: User = await this.userRepository.deleteOne(userId);
        if (!deleteUserById) {
            throw new NotFound("User doesn't exist");
        }

        return deleteUserById;
    }
}

export default UserService;
