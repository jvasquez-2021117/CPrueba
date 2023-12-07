'use strict'

const Publication = require('./publication.model');
const User = require('../user/user.model');
const History = require('../history/history.model');
const path = require('path');
const fs = require('fs');
const { validateData } =  require('../utils/validate')

exports.add = async (req, res) => {
    try {
        let data = req.body;
        if (!req.files || !req.files.image || !req.files.image.type) {
            return res.status(400).send({ message: 'No image file provided' });
        }
        let credentials = {
            title: data.title,
            price: data.price,
            quantity: data.quantity
        }
        let msg = validateData(credentials);
        if(msg) return res.status(400).send({message: msg});
        const filePath = req.files.image.path;
        const fileSplit = filePath.split('\\');
        const fileName = fileSplit[2];
        const extension = path.extname(fileName).toLowerCase();
        const allowedExtensions = ['.png', '.jpg', '.jpeg'];
        if (!allowedExtensions.includes(extension)) {
            fs.unlinkSync(filePath);
            return res.status(400).send({ message: 'Invalid image file extension' });
        }
        data.image = fileName;
        let newPublication = new Publication(data);
        await newPublication.save();
        const dataHistory = {
            user: data.user,
            action: 'Publicacion creada',
            publication: newPublication._id
        }
        const newHistory = new History(dataHistory);
        newHistory.save();
        return res.status(200).send({ message: 'Publication created' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error adding publication', Error: err.message});
    }
}

exports.getImage = async (req, res) => {
    try {
        const fileName = req.params.fileName;
        const filePath = `./upload/publication/${fileName}`
        const image = fs.existsSync(filePath)
        if (!image) return res.status(404).send({ message: 'Image not found' })
        return res.sendFile(path.resolve(filePath));
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting image' })
    }
}

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const publicationDeleted = await Publication.findOneAndDelete({ _id: id });
        if (!publicationDeleted) return res.send({ message: 'Publication not found and not deleted' });
        return res.send({ message: 'Publication deleting succesfully' });
    } catch (e) {
        console.error(err);
        return res.status(500).send({ message: 'Error deleted publication', Error: err.messsage })
    }
}

exports.get = async (req, res) => {
    try {
        const publications = await Publication.find().populate('user');
        return res.status(200).send({ publications });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ message: 'Error getting', Error: err.messsage})
    }
}

exports.getNoUser = async (req, res) => {
    try {
        const { id } = req.params;
        const publications = await Publication.find({user: {$ne: id }}).populate('user');
        return res.status(200).send({ publications });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ message: 'Error getting', Error: err.messsage})
    }
}

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const publications = await Publication.find({ user: id }).populate('user');
        return res.status(200).send({ publications });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ message: 'Error getting', Error: err.messsage })
    }
}

exports.buy = async(req, res) => {
    try{
        const data = req.body;
        const publication = await Publication.findOne({_id: data.publication});
        if(data.quantity > publication.quantity) return res.send({message: 'El vendedor no tiene la cantidad de unidades que necesitas'});
        const buyPublication = await Publication.findOneAndUpdate({_id: data.publication}, { $inc: { quantity: -data.quantity } }, {new: true});
        const dataHistoryBuy = {
            user: data.user,
            action: 'Oferta comprada',
            publication: buyPublication._id,
            quantity: data.quantity
        }
        const dataHistorySell = {
            user: buyPublication.user,
            action: 'Oferta vendida',
            publication: buyPublication._id,
            quantity: data.quantity
        }
        const newHistory = new History(dataHistoryBuy);
        newHistory.save();
        const newHistory2 = new History(dataHistorySell);
        newHistory2.save();
        return res.status(200).send({message: 'successful purchase'});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error sopping'});
    }
}



