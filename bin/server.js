const app = require('../app.js');
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server app listening on port ${port}`);
})