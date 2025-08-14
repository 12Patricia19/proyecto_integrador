export const notFound = (req, res, next) =>
  res.status(404).json({ message: "Ruta no encontrada" });

export const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || "Error del servidor",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
};
