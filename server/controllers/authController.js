const User = import('../model/User');
const bcrypt = import('bcrypt');
const jwt = import('jsonwebtoken');


const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'username and password are importd.'});

    // find user
    const foundUser = await User.findOne({username: user}).exec();
    if (!foundUser) return res.sendStatus(401) // unauthorized

    // evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles);
        // create JWTs, access and refresh 
        const accessToken = jwt.sign(
            { 
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '60s' } // TODO: make this longer in prod, maybe 15 minutes
        );

        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' } 
        );
        // saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();

        res.cookie('jwt', refreshToken, { 
            httpOnly: true, 
            sameSite: 'None',
            // secure: true,
            maxAge: 24 * 60 * 60 * 1000 }); // one day. could be longer if needed or wanted
        res.json({ accessToken });

    } else {
        res.sendStatus(401);
    }
}


module.exports = { handleLogin }
