const jwt = require('jsonwebtoken');
const School = require('../../schema/schoolSchema')

const activeAcount = async (req, res) => {
    const { token } = req.params;

    const data = jwt.verify(token,'dsfhgd');
    // console.log(data);

    try {
        const dbData = await School.findOne({_id: data.id});
        const update = {
            name: data.name,
            email: data.email,
            pasword: data.pasword,
            role: data.role,
            isActive: true
        }
        const updatedData = await School.findOneAndUpdate({_id: dbData.id}, update, {new: true});
        res.status(200).send({
            status: 200,
            message: 'activated successfully',
            Data: updatedData
        });
    } catch (error) {
        console.log(error);
    }

}

module.exports = {activeAcount}