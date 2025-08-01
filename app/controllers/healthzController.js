exports.checkHealth = (req, res) => {
  res.status(202).json({
    status: 'accepted',
    message: 'born to be Health',
  });
};