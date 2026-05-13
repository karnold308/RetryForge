import User from '../model/User.js';


const handleLogout = async (req, res) => {
    // TODO on client, also delete access token

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // no content
    const refreshToken = cookies.jwt;

    // is refresh token in db
    const foundUser = await User.findOne({ refreshToken}).exec();
    if (!foundUser) {
        res.clearCookie('jwt', {
            httpOnly: true, 
            sameSite: 'None',
            secure: true
        });
        return res.sendStatus(204); // no content
    }

    // delete refresh token in db
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(result);

    res.clearCookie('jwt', {
        httpOnly: true, 
        sameSite: 'None',
        secure: true
    }); // TODO: add secure: true - only serves on https

    res.sendStatus(204)

}


export { handleLogout }