const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs').promises; // Use fs.promises for async file operations

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 3000;
const filepath = './data.json';

app.post('/postValue', async (req, res) => {
    const { value } = req.body;
    console.log('Value: ', value);

    try {
        // Step 1: Read the existing data
        let existingData;
        try {
            existingData = JSON.parse(await fs.readFile(filepath, 'utf8'));
        } catch (err) {
            // If the file does not exist or is empty, start with an empty object
            existingData = {};
        }

        // Step 2: Append the new data
        existingData.value = value; // This will overwrite the same key. If you want to keep multiple values, consider using an array or a more complex object structure.

        // Step 3: Write the updated data back to the file
        const content = JSON.stringify(existingData, null, 2);
        await fs.writeFile(filepath, content, 'utf8');
        res.status(200).send({message: 'Data saved successfully'});
    } catch (err) {
        console.log('Error processing the file: ', err);
        res.status(500).send({message: 'Fail to save data'});
    }
});


app.get('/getData', async (req, res) => {
    try {
        const data = await fs.readFile(filepath, 'utf8');
        res.status(200).send(JSON.parse(data));
    } catch (err) {
        console.log('Error reading the file: ',err);
        res.status(500).send({message: 'Fail to read data'});
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});