export class FindUserById {
    userRepo;
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async exec(id) {
        const user = await this.userRepo.findById(id);
        return user;
    }
}
