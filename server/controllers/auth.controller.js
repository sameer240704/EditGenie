import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";

const JWT_SECRET = process.env.JWT_SECRET || 'jeetenge_hum_hum_hi_jeetenge';

export const registerUser = async (req, res) => {
    const { name, password, email } = req.body;

    const primaryImageFile = req.files.avatar ? req.files.avatar[0] : null;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let primaryImageUrl = null;

        if (primaryImageFile) {
            try {
                const b64 = Buffer.from(primaryImageFile.buffer).toString("base64");
                const dataURI = "data:" + primaryImageFile.mimetype + ";base64," + b64;

                const cldRes = await cloudinary.uploader.upload(dataURI, {
                    resource_type: "auto",
                });

                primaryImageUrl = cldRes.secure_url;
            } catch (uploadError) {
                console.error("Error uploading primary image to Cloudinary:", uploadError);
                return res.status(500).json({ error: "Error uploading primary image" });
            }
        }

        const userData = {
            name,
            password: hashedPassword,
            email,
            avatar: primaryImageUrl,
        };

        const newUser = new User(userData);
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(201).json({
            message: "User created successfully",
            user: {
                name: newUser.name,
                email: newUser.email,
                avatar: newUser.avatar
            }
        });
    } catch (error) {
        console.error("Error in sign up:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(400).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: existingUser._id }, JWT_SECRET, {
            expiresIn: "1h",
        });


        return res.status(200).json({
            message: "Login successful",
            user: {
                name: existingUser.name,
                email: existingUser.email,
                avatar: existingUser.avatar
            }
        });
    } catch (error) {
        console.error("Error in login:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get the user based on id
export const getUserById = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User retrieved successfully",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                primaryImage: user.primaryImage,
            }
        });
    } catch (error) {
        console.error("Error retrieving user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logoutUser = async (req, res) => {
    res.clearCookie('token').json({ message: "Logged out successfully" });
};

