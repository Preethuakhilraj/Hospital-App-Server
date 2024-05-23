const express = require('express');
const fs = require('fs').promises; 
const app = express();
app.use(express.json());

const filePath = './hospitals.json';

app.get('/getData', async (req, res) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const hospitals = JSON.parse(data);
    res.send(`Successful! Hospital Records provided below:\n ${JSON.stringify(hospitals)}`);
  } catch (err) {
    console.error('Error reading the file:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/postData', async (req, res) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const hospitals = JSON.parse(data);
    hospitals.push(req.body);
    await fs.writeFile(filePath, JSON.stringify(hospitals, null, 2));
    res.send(`Successful! new Hospital added:\n ${JSON.stringify(hospitals)}`);
  } catch (err) {
    console.error('Error writing to the file:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.put('/updateData', async (req, res) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const hospitals = JSON.parse(data);
    const hospitalIndex = hospitals.findIndex(h => h.id === req.body.id);
    if (hospitalIndex === -1) {
      res.status(404).send('Hospital not found');
      return;
    }
    hospitals[hospitalIndex] = req.body;
    await fs.writeFile(filePath, JSON.stringify(hospitals, null, 2));
    res.send(`Successful! Hospital Records updated:\n ${JSON.stringify(hospitals)}`);
  } catch (err) {
    console.error('Error writing to the file:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/deleteData', async (req, res) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    let hospitals = JSON.parse(data);
    const hospitalIndex = hospitals.findIndex(h => h.id === req.body.id);
    if (hospitalIndex === -1) {
      res.status(404).send('Hospital not found');
      return;
    }
    hospitals.splice(hospitalIndex, 1);
    await fs.writeFile(filePath, JSON.stringify(hospitals, null, 2));
    res.send(`Successful! Hospital Records deleted & updated:\n ${JSON.stringify(hospitals)}`);
  } catch (err) {
    console.error('Error writing to the file:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
