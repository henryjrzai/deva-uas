import users from "./data/users";


export function registerUser(user) {
    const newUser = {
        id: users.length + 1,
        ...user,
        role: "customer",
        createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    const response = {
        status: 201,
        message: "Pendaftaran Berhasil :)",
        data: newUser,
    }
    return response;
}