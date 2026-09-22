require('dotenv').config();  

const app = require('./app');

const PORT = process.env.PORT || 5000;
const connectDB = require('./Config/databases');


connectDB().then(() => {
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("hello testng");
  
})
});