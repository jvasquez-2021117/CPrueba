'use strict'

const History = require('./history.model');

exports.create = async({req, res, user, action, publication}) => {
    try{
        const data = {
            user: user,
            action: action,
            publication: publication
        }
        const newHistory = new History(data);
        newHistory.save();
        return res.status(200).send({message: 'History Created'})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error creating', Errror: err});
    }
}

exports.getHistory = async(req, res) => {
    try{
        const history = await History.find();
        return res.status(200).send({history});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting'})
    }
}

exports.getByUser = async(req, res) => {
    try{
        const { id } = req.params
        const history = await History.find({user: id}).populate('user').populate('publication');
        return res.status(200).send({history});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting'});
    }
}

exports.getSold = async(req, res) => {
    try{
        const { id } = req.params;
        const sold = await History.find({ $and: [ { user: id}, { action: 'Oferta vendida' } ] }).populate('user').populate('publication');
        return res.status(200).send({sold});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting'})
    }
}

exports.getBought = async(req, res) => {
    try{
        const { id } = req.params;
        const bought = await History.find({ $and: [ { user: id}, { action: 'Oferta comprada' } ] }).populate('user').populate('publication');
        return res.status(200).send({bought});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting'})
    }
}