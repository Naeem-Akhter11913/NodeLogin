const { sendEmail } = require('../email/sendEmail');
const School = require('../schema/schoolSchema');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {

    const { name, email, password, role } = req.body;

    const isValid = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        role: Joi.string().required()
    }).validate(req.body);

    if (isValid.error) {
        res.status(404).send({
            message: isValid.error.message,
        });
    }

    try {
        const checkData = await School.findOne({ name, email });
        if (checkData) {
            return res.status(400).send({
                status: 400,
                message: 'User name and email already exists please try with different email and password',
            });
        } else {
            const havePassword = await bcrypt.hash(password, 10);
            const schoolRegObj = School({
                name,
                email,
                password: havePassword,
                role
            });

            const saveData = await schoolRegObj.save();

            const payload = {
                id: saveData._id,
                name: saveData.name
            };

            const token = jwt.sign(payload, 'dsfhgd', { expiresIn: '1d' });

            const link = `http://localhost:3000/actives/${token}`;
            await sendEmail(email, "active account", link);



            if (saveData.isActive === false) {
                const user = await School.findOne({ email });

                const payload = {
                    id: user._id,
                    name: user.name
                };

                const token = jwt.sign(payload, 'dsfhgd', { expiresIn: '1d' });

                return res.status(200).send({
                    status: 200,
                    message: 'account is created check your email to activate Account',
                    data: saveData,
                });
            } else {
                res.status(200).send({
                    message: 'wait for Activaton',
                    data: saveData
                });
            }
        }

    } catch (error) {
        res.status(400).send({
            status: 400,
            message: error.message
        });
    }
};

const loginSchool = async (req, res) => {
    const { email, password } = req.body;
    // console.log(email, password);

    try {
        const findUser = await School.findOne({ email });
        // console.log(findUser)

        if (!findUser) {
            return res.status(404).send({
                status: 404,
                message: 'You have No Account or check your email and password'
            });
        }
        const match = await bcrypt.compare(password, findUser.password);

        const { _id, name, role, isActive } = findUser;

        if (match) {
            if (role === 'school' && isActive) {
                const payload = {
                    _id,
                    name,
                };

                const token = jwt.sign(payload, 'hhshs', { expiresIn: '1d' });

                res.status(200).send({
                    status: 200,
                    message: 'logged in successfull',
                    id: _id,
                    token: token
                });
            } else {
                res.status(400).send({
                    status: 400,
                    message: 'Active Your Account First',
                });
            }
        } else {
            res.status(400).send({
                status: 400,
                message: 'Check Your Password',
            });
        }

    } catch (error) {
        res.status(400).send({
            status: 400,
            message: error.message
        });
    }
};

module.exports = {
    register,
    loginSchool
}