export const routeNotFoundHander = (
  req,
  res,
  next
) => {
  res.status(404).json({ success: false, message: "No route found" });
};
