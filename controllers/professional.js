import Professional from "../models/Professional.js";

// controllers/professionalController.js

// import Professional from "../models/Professional.js";
import Request from "../models/Request.js";

// Update professional's location
export const updateLocation = async (req, res) => {
    const { professionalId, latitude, longitude } = req.body;
    try {
        await Professional.findByIdAndUpdate(professionalId, {
            location: {
                type: 'Point',
                coordinates: [longitude, latitude]
            }
        });
        res.status(200).json({ message: 'Location updated successfully' });
    } catch (error) {
        console.error('Error updating location:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const updateProfessional = async (req,res,next)=> {
	try{
		const updatedProfessional = await Professional.findByIdAndUpdate(req.params.id, { $set: req.body}, {new:true})
		res.status(200).json(updatedProfessional)
	} catch (err){
		next(err);
	}
}

export const getNearbyProfessionals = async (req, res, next) => {
    const { latitude, longitude, maxDistance, profession } = req.query;

    if (!latitude || !longitude || !maxDistance) {
        return res.status(400).json({ error: 'Latitude, longitude, and maxDistance are required' });
    }

    try {
        let query = {
            location: {
                $geoWithin: {
                    $centerSphere: [[longitude, latitude], maxDistance / 6378.1] // maxDistance in kilometers, Earth's radius in kilometers
                }
            }
        };

        if (profession) {
            query.profession = {
                $in: [profession]
            };
        }

        const professionals = await Professional.find(query);

        res.status(200).json(professionals);
    } catch (error) {
        console.error('Error fetching nearby professionals:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const deleteProfessional = async (req,res,next)=> {
	try{
		await Professional.findByIdAndDelete(
			req.params.id
		);
		res.status(200).json("Professional has been deleted")
	} catch (err){
		next(err);
	}
}

export const rateProfessional = async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;

    try {
        // Find the professional by ID
        const professional = await Professional.findById(id);

        if (!professional) {
            return res.status(404).json({ error: 'Professional not found' });
        }

        // Update the rating
        professional.rating = rating;
        
        // Save the updated professional
        await professional.save();

        return res.json(professional);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server Error' });
    }
};


export const getProfessional = async (req,res,next)=> {
	try{
		const professional = await Professional.findById(
			req.params.id
		);
		res.status(200).json(professional)
	} catch (err){
		next(err);
	}
}


export const getProfessionals = async (req, res, next) => {
    const qProfession = req.query.profession;
    try {
        let professionals;

        // Find professionals with pending requests
        const pendingRequests = await Request.find({ status: 'pending' }).select('professionalId');
        const pendingProfessionalIds = pendingRequests.map(request => request.professionalId);

        if (qProfession) {
            professionals = await Professional.find({
                profession: { $in: [qProfession] },
                _id: { $nin: pendingProfessionalIds } // Exclude professionals with pending requests
            });
        } else {
            professionals = await Professional.find({
                _id: { $nin: pendingProfessionalIds } // Exclude professionals with pending requests
            });
        }
        res.status(200).json(professionals);
    } catch (err) {
        next(err);
    }
};