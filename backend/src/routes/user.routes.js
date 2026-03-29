router.get('/managers', async (req, res) => {
  try {
    const managers = await User.find({ role: 'manager' });
    res.json(managers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching managers' });
  }
});