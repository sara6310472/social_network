const bcrypt = require('bcrypt');
const Users = require('../models/Users');
const Passwords = require('../models/Passwords');
const { generateToken } = require('../middleware/auth');
const logger = require('../logs/logger');

const validateRegistration = (userData) => {
    const { userName, email, phoneNumber, website, password } = userData;
    if (!userName || !email || !phoneNumber || !website || !password) {
        return 'Missing required fields';
    }
    return null;
};

const checkExistingUser = async (email, website) => {
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
        logger.warn(`Registration attempt with existing email: ${email}`);
        return { error: 'Email already in use', status: 409 };
    }

    const existingWebsite = await Users.findOne({ where: { website } });
    if (existingWebsite) {
        logger.warn(`Registration attempt with existing website: ${website}`);
        return { error: 'Website already in use', status: 409 };
    }

    return null;
};

const createUserWithPassword = async (userData) => {
    const { userName, email, phoneNumber, website, password } = userData;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await Users.create({ userName, email, phoneNumber, website });
   
    await Passwords.create({
        userId: user.id,
        hashedPassword
    });

    return user;
};

const prepareUserResponse = (user, token) => {
    return {
        id: user.id,
        name: user.userName || user.dataValues.userName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        website: user.website,
        token
    };
};

exports.register = async (req, res) => {
    try {
        const validationError = validateRegistration(req.body);
        if (validationError) {
            logger.warn(`Registration attempt with invalid data`);
            return res.status(400).json({ error: validationError });
        }

        const { email, website } = req.body;
        const existingUser = await checkExistingUser(email, website);
        if (existingUser) {
            return res.status(existingUser.status).json({ error: existingUser.error });
        }

        const user = await createUserWithPassword(req.body);

        const token = generateToken(user);
        logger.info(`User registered successfully: ${user.id}`);

        const response = {
            message: 'User registered successfully',
            token,
            user: prepareUserResponse(user, null)
        };

        res.status(201).json(response);
    } catch (err) {
        logger.error(`Registration error: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};

async function verifyUserCredentials(email, password) {
    const user = await Users.findOne({
        where: { email },
        attributes: ['id', 'userName', 'email', 'phoneNumber', 'website']
    });

    if (!user) {
        logger.warn(`Login attempt with non-existent email: ${email}`);
        return { error: 'Invalid credentials', status: 401 };
    }

    const passwordRecord = await Passwords.findOne({ where: { userId: user.id } });
    if (!passwordRecord) {
        logger.warn(`User ${user.id} has no password record`);
        return { error: 'Invalid credentials', status: 401 };
    }

    const match = await bcrypt.compare(password, passwordRecord.hashedPassword);
    if (!match) {
        logger.warn(`Failed login attempt for user ${user.id}`);
        return { error: 'Invalid credentials', status: 401 };
    }

    return { user, status: 200 };
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            logger.warn(`Login attempt with missing fields`);
            return res.status(400).json({ error: 'Missing fields' });
        }

        const authResult = await verifyUserCredentials(email, password);
        if (authResult.error) {
            return res.status(authResult.status).json({ error: authResult.error });
        }

        const token = generateToken(authResult.user);
        logger.info(`User logged in successfully: ${authResult.user.id}`);

        res.json(prepareUserResponse(authResult.user, token));
    } catch (err) {
        logger.error(`Login error: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};


// const bcrypt = require('bcrypt');
// const Users = require('../models/Users');
// const Passwords = require('../models/Passwords');
// const { generateToken } = require('../middleware/auth');
// const logger = require('../logs/logger');

// const validateRegistration = ({ userName, email, phoneNumber, website, password }) => {
//     if (!userName || !email || !phoneNumber || !website || !password) {
//         return 'Missing required fields';
//     }
//     return null;
// };

// const checkExistingUser = async (email, website) => {
//     const existingUser = await Users.findOne({ where: { email } });
//     if (existingUser) {
//         logger.warn(`Registration attempt with existing email: ${email}`);
//         return { error: 'Email already in use', status: 409 };
//     }

//     const existingWebsite = await Users.findOne({ where: { website } });
//     if (existingWebsite) {
//         logger.warn(`Registration attempt with existing website: ${website}`);
//         return { error: 'Website already in use', status: 409 };
//     }

//     return null;
// };

// exports.register = async (req, res) => {
//     try {
//         const { userName, email, phoneNumber, website, password } = req.body;

//         const validationError = validateRegistration(req.body);
//         if (validationError) {
//             logger.warn(`Registration attempt with invalid data`);
//             return res.status(400).json({ error: validationError });
//         }

//         const existingUser = await checkExistingUser(email, website);
//         if (existingUser) {
//             return res.status(existingUser.status).json({ error: existingUser.error });
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create the user
//         const user = await Users.create({ userName, email, phoneNumber, website });

//         // Store the password separately
//         await Passwords.create({
//             userId: user.id,
//             hashedPassword
//         });

//         const token = generateToken(user);
//         logger.info(`User registered successfully: ${user.id}`);

//         res.status(201).json({
//             message: 'User registered successfully',
//             token,
//             user: {
//                 id: user.id,
//                 name: user.userName,
//                 email: user.email,
//                 phoneNumber: user.phoneNumber,
//                 website: user.website
//             }
//         });
//     } catch (err) {
//         logger.error(`Registration error: ${err.message}`);
//         res.status(500).json({ error: err.message });
//     }
// };


// exports.login = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//             logger.warn(`Login attempt with missing fields`);
//             return res.status(400).json({ error: 'Missing fields' });
//         }

//         const user = await Users.findOne({
//             where: { email },
//             attributes: ['id', 'userName', 'email', 'phoneNumber', 'website']
//         });

//         if (!user) {
//             logger.warn(`Login attempt with non-existent email: ${email}`);
//             return res.status(401).json({ error: 'Invalid credentials' });
//         }

//         const passwordRecord = await Passwords.findOne({ where: { userId: user.id } });

//         if (!passwordRecord) {
//             logger.warn(`User ${user.id} has no password record`);
//             return res.status(401).json({ error: 'Invalid credentials' });
//         }

//         const match = await bcrypt.compare(password, passwordRecord.hashedPassword);

//         if (!match) {
//             logger.warn(`Failed login attempt for user ${user.id}`);
//             return res.status(401).json({ error: 'Invalid credentials' });
//         }

//         const token = generateToken(user);
//         logger.info(`User logged in successfully: ${user.id}`);

//         res.json({
//             id: user.id,
//             name: user.dataValues.userName,
//             email: user.email,
//             phoneNumber: user.phoneNumber,
//             website: user.website,
//             token
//         });
//     } catch (err) {
//         logger.error(`Login error: ${err.message}`);
//         res.status(500).json({ error: err.message });
//     }
// };