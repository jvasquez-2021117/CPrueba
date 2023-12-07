'use strict'

const User = require('./user.model');
const { encrypt, validateData, checkPassword } =  require('../utils/validate');
const { createToken } = require('../service/jwt');

exports.register = async(req, res) => {
    try{
        let data = req.body;
        let credentials = {
            name: data.name,
            phone: data.phone,
            email: data.email,
            password: data.password
        }
        let msg = validateData(credentials);
        if(msg) return res.status(400).send({message: msg});
        const userAlreadyExists = await User.findOne({email: data.email});
        if(userAlreadyExists) return res.send({message: 'User with this email already exists'});
        data.password = await encrypt(data.password);
        data.role = 'client';
        const user = new User(data);
        await user.save();
        return res.status(200).send({message: 'Account created successfully'});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error creating account', Error: err.message});
    }
}

exports.createAdmin = async(req, res) => {
    try{
        let data = {
            name: 'admin',
            phone: '00000000',
            email: 'admin@gmail.com',
            password: 'admin',
            role: 'admin'
        }
        data.password = await encrypt(data.password);
        let exists = await User.findOne({name: 'admin'});
        if(exists) return
        const user = new User(data);
        await user.save();
        return console.log('Admin created successfully');
    }catch(err){
        console.error(err);
        return console.log('Error creating admin');
    }
}

exports.login = async(req, res) => {
    try{
        let data = req.body;
        let credentials = {
            emal: data.email,
            password: data.password
        }
        let msg = validateData(credentials);
        if(msg) return res.status(400).send({msg});
        let user = await User.findOne({email: data.email});
        if(user && await checkPassword(data.password, user.password)){
            let token = await createToken(user);
            let userLogged = {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            }
            return res.status(200).send({message: 'User logged sucessfully', token, userLogged});
        }
        return res.status(200).send({message: 'Invalid credentials'});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error not logged', Error: err.message});
    }
}

exports.getUsers = async(req, res)=>{
    try{
        const users = await User.find();
        return res.status(200).send({users});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting categories', Error: err.message});
    }
}

exports.getUser = async(req, res)=>{
    try{
        let { email } = req.body;
        let user = await User.findOne({email: email});
        if(!user) return res.send({message: 'User not found'});
        return res.status(200).send({user});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting category', Error: err.message});
    }
}

exports.update = async(req, res)=>{
    try{
        const { id } = req.params;
        let data = req.body;
        if(id != req.user.sub) return res.status(401).send({message: 'Dont have permission to do this action'});
        if(data.password || Object.entries(data).leng === 0 || data.role) return res.status(400).send({message: 'Have submitted some data that cannot be updated'});
        let userUpdate = await User.findOneAndUpdate(
            {_id: req.user.sub},
            data,
            {new: true}
        )
        if(!userUpdate) res.send({message: 'User not found and not update'});
        return res.status(200).send({message: 'User update'});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error not update is already token', Error: err.message});
    }
}

exports.delete = async(req, res)=>{
    try{
        const { id } = req.params;
        if(id != req.user.sub) return res.status(401).send({message: 'Dont have permission to do this acction'});
        let userDelete = await User.findByIdAndDelete({_id: req.user.sub});
        if(!userDelete) return res.send({message: 'Acount not found and not deleted'});
        return res.status(200).send({message: `Account whit username ${userDelete.username} deleted sucessfully`});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error not deleted', Error: err.message});
    }
}
