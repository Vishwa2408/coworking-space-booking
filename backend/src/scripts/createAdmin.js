require("../config/env");

const bcrypt = require("bcryptjs");

const connectDatabase = require("../config/database");
const { User, USER_ROLES } = require("../models/User");
const {
    adminName,
    adminEmail,
    adminPassword,
} = require("../config/env");

const createAdmin = async () => {
    try {
        await connectDatabase();

        const existingAdmin = await User.findOne({
            email: adminEmail,
        });

        if (existingAdmin) {
            console.log(`Admin account already exists for ${adminEmail}.`);
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 12);

        await User.create({
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            role: USER_ROLES.ADMIN,
        });

        console.log("Admin account created successfully.");
        console.log(`Email: ${adminEmail}`);

        process.exit(0);
    } catch (error) {
        console.error("Failed to create admin:", error);
        process.exit(1);
    }
};

createAdmin();