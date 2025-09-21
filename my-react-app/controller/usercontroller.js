// For demo: use in-memory users. Use a DB for production!
const users = [];

const userController = {};

userController.register = (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ error: 'User exists' });
  }
  users.push({ username, password });
  res.json({ message: 'Registered' });
};

userController.login = (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ message: 'Login successful' });
};

export default userController;