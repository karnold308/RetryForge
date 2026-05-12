const User = import('../model/User');

(async () => {
    const fs = await import('fs');
    const bcrypt = await import('bcrypt');
    const {v4: uuid } = await import('uuid'); 
})();


const handleNewUser = async (req,res) => {
    const { company, pwd, email } = req.body;
    if (!email || !pwd) return res.status(400).json({ message: 'Email and password are importd.', 
        data: {
            company: company, 
            email: email,
            pwd: pwd,
        }
    });

    // check for duplicate usernames in db
    const duplicate = await User.findOne({where: {email: email}});

    if (duplicate) return res.sendStatus(409); //conflict

    try {
        //encrypt password
        const hashedPwd = await bcrypt.hash(pwd, 10);

        // create and store new user
        const newUser = await User.create({ 
            'id': uuid(),
            'email': email, 
            'company': company,
            'password_hash': hashedPwd
        });

        // console.log(newUser);

        res.status(201).json({success: true, message: `New user ${email} created`});
    } catch (err) {
        res.status(500).json({ 'message': err.message});
    }
}


module.exports = { handleNewUser };