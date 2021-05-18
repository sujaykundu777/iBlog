import bcrypt from 'bcryptjs';

// hash password
const hashPassword = async password => {

    if(!password){
        throw new Error('Password was not provided')
    }
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

// verify passwords
const verifyPassword = async (candidate, actual) => {
    return await bcrypt.compare(candidate, actual);
}

export { hashPassword, verifyPassword };

