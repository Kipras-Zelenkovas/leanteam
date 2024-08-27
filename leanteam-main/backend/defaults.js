import { User } from "./database/models/User.js";
import bcrypt from "bcrypt";

(async () => {
    await User.create({
        email: "kipraszelenkovas@gmail.com",
        password: bcrypt.hashSync("Kiprionikas123", 10),
        name: "Kipras",
        surname: "Zelenkovas",
        roles: {
            Superadmin: 1000,
        },
    });
})();
