import { validationResult } from "express-validator";
import Trip from "../models/trip.model.js";
import TripRequest from "../models/tripRequest.model.js";

export const getAll = async (req, res, next) => {
  try {
    const { origen, destino, fecha, limit = 20, page = 1 } = req.query;
    
    // Construir filtros de búsqueda
    const filters = { estado: "disponible" };
    
    if (origen) {
      filters["origen.direccion"] = { $regex: origen, $options: "i" };
    }
    
    if (destino) {
      filters["destino.direccion"] = { $regex: destino, $options: "i" };
    }
    
    if (fecha) {
      const startDate = new Date(fecha);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      filters.fechaHoraSalida = { $gte: startDate, $lt: endDate };
    }
    
    const skip = (page - 1) * limit;
    
    const items = await Trip.find(filters)
      .populate("creador", "nombres apellidos email telefono calificacion vehiculo")
      .populate("pasajeros.usuario", "nombres apellidos email")
      .sort({ fechaHoraSalida: 1 })
      .limit(parseInt(limit))
      .skip(skip);
      
    const total = await Trip.countDocuments(filters);
    
    res.json({
      trips: items,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (e) { next(e); }
};

export const getById = async (req, res, next) => {
  try {
    const t = await Trip.findById(req.params.id)
      .populate("creador", "nombres apellidos email telefono calificacion totalViajes vehiculo")
      .populate("pasajeros.usuario", "nombres apellidos email telefono calificacion");
    if (!t) return res.status(404).json({ message: "Viaje no encontrado" });
    res.json(t);
  } catch (e) { next(e); }
};

export const create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    const trip = await Trip.create({
      ...req.body,
      creador: req.user?.id || req.body.creador
    });
    
    const populatedTrip = await Trip.findById(trip._id)
      .populate("creador", "nombres apellidos email telefono calificacion vehiculo");
    
    res.status(201).json(populatedTrip);
  } catch (e) { next(e); }
};

export const update = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    const t = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("creador", "nombres apellidos email telefono calificacion vehiculo")
      .populate("pasajeros.usuario", "nombres apellidos email");
    
    if (!t) return res.status(404).json({ message: "Viaje no encontrado" });
    res.json(t);
  } catch (e) { next(e); }
};

export const remove = async (req, res, next) => {
  try {
    const t = await Trip.findByIdAndDelete(req.params.id);
    if (!t) return res.status(404).json({ message: "Viaje no encontrado" });
    res.json({ message: "Viaje eliminado" });
  } catch (e) { next(e); }
};

// Solicitar unirse a un viaje
export const requestJoin = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const { mensaje, solicitante } = req.body;
    const solicitanteId = req.user?.id || solicitante;
    
    console.log('Request join - tripId:', tripId);
    console.log('Request join - solicitanteId:', solicitanteId);
    console.log('Request join - mensaje:', mensaje);
    
    if (!solicitanteId) {
      return res.status(400).json({ message: "ID del solicitante es requerido" });
    }
    
    // Verificar que el viaje existe
    const trip = await Trip.findById(tripId).populate("creador");
    if (!trip) {
      console.log('Trip not found:', tripId);
      return res.status(404).json({ message: "Viaje no encontrado" });
    }
    
    console.log('Trip found:', trip.origen.direccion, 'to', trip.destino.direccion);
    
    // Verificar que hay cupos disponibles
    if (trip.cuposOcupados >= trip.cupos) {
      return res.status(400).json({ message: "No hay cupos disponibles" });
    }
    
    // Verificar que no es el creador del viaje
    if (trip.creador._id.toString() === solicitanteId.toString()) {
      return res.status(400).json({ message: "No puedes solicitar tu propio viaje" });
    }
    
    // Verificar si ya existe una solicitud
    const existingRequest = await TripRequest.findOne({
      viaje: tripId,
      solicitante: solicitanteId
    });
    
    if (existingRequest) {
      return res.status(400).json({ message: "Ya has solicitado unirte a este viaje" });
    }
    
    // Crear la solicitud
    console.log('Creating trip request...');
    const request = await TripRequest.create({
      viaje: tripId,
      solicitante: solicitanteId,
      conductor: trip.creador._id,
      mensaje: mensaje || ''
    });
    
    console.log('Trip request created:', request._id);
    
    const populatedRequest = await TripRequest.findById(request._id)
      .populate("solicitante", "nombres apellidos email telefono")
      .populate("viaje", "origen destino fechaHoraSalida");
    
    res.status(201).json({
      success: true,
      message: "Solicitud enviada exitosamente",
      request: populatedRequest
    });
  } catch (e) {
    console.error('Error in requestJoin:', e);
    if (e.code === 11000) {
      return res.status(400).json({ message: "Ya has solicitado unirte a este viaje" });
    }
    next(e);
  }
};

// Responder a una solicitud de viaje
export const respondToRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const { estado, motivoRechazo } = req.body;
    
    console.log('Responding to request:', requestId, 'with estado:', estado);
    
    // Validar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ 
        message: "Datos inválidos",
        errors: errors.array() 
      });
    }
    
    const request = await TripRequest.findById(requestId)
      .populate("viaje")
      .populate("solicitante", "nombres apellidos email");
    
    if (!request) {
      console.log('Request not found:', requestId);
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }
    
    console.log('Found request:', request._id, 'current estado:', request.estado);
    
    // Actualizar la solicitud
    request.estado = estado;
    request.fechaRespuesta = new Date();
    if (motivoRechazo) request.motivoRechazo = motivoRechazo;
    
    await request.save();
    console.log('Request updated with estado:', estado);
    
    // Si se acepta, agregar al pasajero y actualizar cupos
    if (estado === "aceptado") {
      console.log('Accepting request, updating trip...');
      const trip = await Trip.findById(request.viaje._id);
      
      if (trip.cuposOcupados >= trip.cupos) {
        console.log('No available spots in trip');
        return res.status(400).json({ message: "No hay cupos disponibles" });
      }
      
      trip.pasajeros.push({
        usuario: request.solicitante._id,
        estado: "aceptado",
        fechaSolicitud: request.createdAt
      });
      
      trip.cuposOcupados += 1;
      
      if (trip.cuposOcupados >= trip.cupos) {
        trip.estado = "lleno";
      }
      
      await trip.save();
      console.log('Trip updated, new cuposOcupados:', trip.cuposOcupados);
    }
    
    const updatedRequest = await TripRequest.findById(requestId)
      .populate("viaje", "origen destino fechaHoraSalida")
      .populate("solicitante", "nombres apellidos email");
    
    console.log('Returning updated request');
    res.json({
      success: true,
      request: updatedRequest
    });
  } catch (e) { 
    console.error('Error in respondToRequest:', e);
    next(e); 
  }
};

// Obtener solicitudes de un conductor
export const getDriverRequests = async (req, res, next) => {
  try {
    const conductorId = req.user?.id || req.params.conductorId;
    
    const requests = await TripRequest.find({ conductor: conductorId })
      .populate("solicitante", "nombres apellidos email telefono calificacion")
      .populate("viaje", "origen destino fechaHoraSalida cupos cuposOcupados")
      .sort({ createdAt: -1 });
    
    res.json({ requests });
  } catch (e) { next(e); }
};

// Obtener solicitudes enviadas por el usuario
export const getUserRequests = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.params.userId;
    console.log('Getting requests for user ID:', userId); // Debug
    
    // Solicitudes enviadas como pasajero
    const sentRequests = await TripRequest.find({ solicitante: userId })
      .populate("conductor", "nombres apellidos email telefono calificacion vehiculo")
      .populate("viaje", "origen destino fechaHoraSalida cupos cuposOcupados costo")
      .sort({ createdAt: -1 });
    
    // Solicitudes recibidas como conductor
    const receivedRequests = await TripRequest.find({ conductor: userId })
      .populate("solicitante", "nombres apellidos email telefono calificacion")
      .populate("viaje", "origen destino fechaHoraSalida cupos cuposOcupados costo")
      .sort({ createdAt: -1 });
    
    console.log('Found sent requests:', sentRequests.length); // Debug
    console.log('Found received requests:', receivedRequests.length); // Debug
    
    res.json({
      success: true,
      sentRequests,
      receivedRequests,
      total: sentRequests.length + receivedRequests.length
    });
  } catch (e) { 
    console.error('Error in getUserRequests:', e); // Debug
    next(e); 
  }
};

// Obtener viajes del usuario
export const getUserTrips = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    console.log('Getting trips for user ID:', userId); // Debug
    
    // Viajes como conductor
    const asDriver = await Trip.find({ creador: userId })
      .populate("creador", "nombres apellidos email telefono calificacion vehiculo")
      .populate("pasajeros.usuario", "nombres apellidos email telefono")
      .sort({ fechaHoraSalida: -1 });
    
    // Viajes como pasajero
    const asPassenger = await Trip.find({ "pasajeros.usuario": userId })
      .populate("creador", "nombres apellidos email telefono vehiculo calificacion")
      .populate("pasajeros.usuario", "nombres apellidos email telefono")
      .sort({ fechaHoraSalida: -1 });
    
    console.log('Found trips as driver:', asDriver.length); // Debug
    console.log('Found trips as passenger:', asPassenger.length); // Debug
    
    res.json({
      success: true,
      asDriver,
      asPassenger,
      total: asDriver.length + asPassenger.length
    });
  } catch (e) { 
    console.error('Error in getUserTrips:', e); // Debug
    next(e); 
  }
};
