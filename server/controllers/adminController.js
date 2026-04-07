import { User } from "../models/UserSchema.js";

export const Approve = async(req, res)=>{
        const {id} = req.body;
        try{
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: 'User not found' });
            user.approval = 'approved';
            await user.save();
            res.json({message: 'approved!'})
        }catch(err){
            res.status(500).json({ message: 'Server Error' });
        }
    }

export const Reject = async(req, res)=>{
        const {id} = req.body;
        try{
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: 'User not found' });
            user.approval = 'rejected';
            await user.save();
            res.json({message: 'rejected!'})
        }catch(err){
            res.status(500).json({ message: 'Server Error' });
        }
    }

export const fetchUser = async (req, res)=>{
        const id = req.params.id;
        try{
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.json(user);
        }catch(err){
            console.log(err);
            res.status(500).json({ message: 'Server Error' });
        }
    }

export const fetchAllUsers =  async (req, res)=>{

        try{
            const users = await User.find();
            res.json(users);

        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
    }

export const DeleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully from database' });
    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).json({ message: 'Server Error during deletion' });
    }
}