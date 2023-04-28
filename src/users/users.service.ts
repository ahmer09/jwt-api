import {BadRequestException, Injectable} from "@nestjs/common";
import {CreateUserDto} from "./create-user.dto";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {HashService} from "./hash.service";
import {User, UserDocument} from "./user.schema";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model < UserDocument > , private hashService: HashService) {}

    async getUserByUsername(username: string) {
        return this.userModel.findOne({
            username
        })
            .exec();
    }

    async registerUser(createUserDto: CreateUserDto) {
        const createUser= new this.userModel(createUserDto);
        const user = await this.getUserByUsername( createUser.username);
        if (user) {
            throw new BadRequestException();
        }
        createUser.password = await this.hashService.hashPassword(createUser.password);
        return createUser.save()

    }
}