// const User = require('../models/userModel');


// exports.getUserProfile = async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         res.status(200).json(user);
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error });
//     }
// };


// exports.updateUserProfile = async (req, res) => {
//     try {
//         const { email, phone, firstName, lastName } = req.body;
//         const user = await User.findById(req.params.id);

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

  
//         user.firstName = firstName || user.firstName;
//         user.lastName = lastName || user.lastName;


//         if (email && email !== user.email) {
//             return res.status(400).json({ message: 'Email change requires verification' });
//         }
//         if (phone && phone !== user.phone) {
//             return res.status(400).json({ message: 'Phone number change requires verification' });
//         }

//         await user.save();
//         res.status(200).json({ message: 'Profile updated successfully', user });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error });
//     }
// };
